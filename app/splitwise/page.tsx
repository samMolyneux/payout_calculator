"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SplitwiseGroup, ExportResponse, PendingExport, DebtPayload } from "@/app/types/splitwise";
import type { Transaction } from "@/app/types";
import AuthPrompt from "./components/AuthPrompt";
import GroupSelector from "./components/GroupSelector";
import MemberMapping from "./components/MemberMapping";
import ExportResult from "./components/ExportResult";
import { convertToPounds } from "@/app/scripts/util";

type Stage = "loading" | "auth" | "groups" | "mapping" | "exporting" | "result";

const STORAGE_KEY_TOKEN = "splitwise_access_token";
const STORAGE_KEY_PENDING = "splitwise_pending_export";
const STORAGE_KEY_STATE = "splitwise_oauth_state";

function SplitwiseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stage, setStage] = useState<Stage>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [groups, setGroups] = useState<SplitwiseGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<SplitwiseGroup | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState<string>("GBP");
  const [result, setResult] = useState<ExportResponse | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchGroups = useCallback(async (accessToken: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/splitwise/groups", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        setToken(null);
        return false;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

      const data = await response.json();
      setGroups(data.groups || []);
      return true;
    } catch (err) {
      console.error("Error fetching groups:", err);
      return false;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      // Check for OAuth callback params
      const urlToken = searchParams.get("token");
      const urlState = searchParams.get("state");
      const urlError = searchParams.get("error");

      if (urlError) {
        setError(urlError);
        // Clear URL params
        window.history.replaceState({}, "", "/splitwise");
        setStage("auth");
        return;
      }

      if (urlToken) {
        // Verify state matches
        const storedState = sessionStorage.getItem(STORAGE_KEY_STATE);
        if (urlState && storedState && urlState !== storedState) {
          setError("oauth_state_mismatch");
          window.history.replaceState({}, "", "/splitwise");
          setStage("auth");
          return;
        }

        // Store token and clear URL
        localStorage.setItem(STORAGE_KEY_TOKEN, urlToken);
        sessionStorage.removeItem(STORAGE_KEY_STATE);
        setToken(urlToken);
        window.history.replaceState({}, "", "/splitwise");
      }

      // Get pending export data
      const pendingData = sessionStorage.getItem(STORAGE_KEY_PENDING);
      if (!pendingData) {
        // No pending data - redirect to calculator
        router.push("/");
        return;
      }

      try {
        const pending: PendingExport = JSON.parse(pendingData);
        setTransactions(pending.transactions);
        setDefaultCurrency(pending.currency || "GBP");
      } catch {
        router.push("/");
        return;
      }

      // Check for existing token
      const existingToken = urlToken || localStorage.getItem(STORAGE_KEY_TOKEN);
      if (existingToken) {
        setToken(existingToken);
        const success = await fetchGroups(existingToken);
        if (success) {
          setStage("groups");
        } else {
          setStage("auth");
        }
      } else {
        setStage("auth");
      }
    };

    init();
  }, [searchParams, router, fetchGroups]);

  const handleGroupSelect = (group: SplitwiseGroup) => {
    setSelectedGroup(group);
    setStage("mapping");
  };

  const handleExport = async (mappings: Record<string, number>, currency: string) => {
    if (!token || !selectedGroup) return;

    setStage("exporting");

    // Convert transactions to debt payloads
    const debts: DebtPayload[] = transactions.map((t) => ({
      from: mappings[t.from],
      to: mappings[t.to],
      amount: parseFloat(convertToPounds(t.val)),
      description: `Payout: ${t.from} owes ${t.to}`,
      group_id: selectedGroup.id,
      currency_code: currency,
    }));

    try {
      const response = await fetch("/api/splitwise/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          debts,
          groupId: selectedGroup.id,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        setToken(null);
        setError("session_expired");
        setStage("auth");
        return;
      }

      const exportResult: ExportResponse = await response.json();
      setResult(exportResult);
      setStage("result");

      // Clear pending data on success
      if (exportResult.success) {
        sessionStorage.removeItem(STORAGE_KEY_PENDING);
      }
    } catch (err) {
      console.error("Export error:", err);
      setResult({
        success: false,
        failedDebts: [
          {
            from: 0,
            to: 0,
            amount: 0,
            error: "Network error. Please check your connection and try again.",
          },
        ],
      });
      setStage("result");
    }
  };

  const handleRetry = () => {
    setResult(null);
    setStage("mapping");
  };

  return (
    <div className="w-full max-w-xl">
      <h1 className="text-2xl font-bold text-center mb-8">Export to Splitwise</h1>

      {stage === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100" />
          <p className="text-gray-400">Loading...</p>
        </div>
      )}

      {stage === "auth" && <AuthPrompt error={error} />}

      {stage === "groups" && (
        <GroupSelector groups={groups} onSelect={handleGroupSelect} />
      )}

      {stage === "mapping" && selectedGroup && (
        <MemberMapping
          group={selectedGroup}
          transactions={transactions}
          defaultCurrency={defaultCurrency}
          onExport={handleExport}
        />
      )}

      {stage === "exporting" && (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100" />
          <p className="text-gray-400">Exporting to Splitwise...</p>
        </div>
      )}

      {stage === "result" && result && (
        <ExportResult result={result} onRetry={handleRetry} />
      )}

      {stage !== "loading" && stage !== "exporting" && (
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-gray-200 text-sm transition-colors"
          >
            Back to Calculator
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full max-w-xl">
      <h1 className="text-2xl font-bold text-center mb-8">Export to Splitwise</h1>
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default function SplitwisePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <Suspense fallback={<LoadingFallback />}>
        <SplitwiseContent />
      </Suspense>
    </main>
  );
}
