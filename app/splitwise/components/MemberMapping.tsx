"use client";

import React, { useState, useMemo } from "react";
import type { SplitwiseGroup } from "@/app/types/splitwise";
import type { Transaction } from "@/app/types";

interface MemberMappingProps {
  group: SplitwiseGroup;
  transactions: Transaction[];
  defaultCurrency: string;
  onExport: (mappings: Record<string, number>, currency: string) => void;
}

const CURRENCIES = ["GBP", "USD", "EUR", "JPY", "INR"];

const MemberMapping: React.FC<MemberMappingProps> = ({
  group,
  transactions,
  defaultCurrency,
  onExport,
}) => {
  // Extract unique player names from transactions
  const playerNames = useMemo(() => {
    const names = new Set<string>();
    transactions.forEach((t) => {
      names.add(t.from);
      names.add(t.to);
    });
    return Array.from(names).sort();
  }, [transactions]);

  const [mappings, setMappings] = useState<Record<string, number>>({});
  const [currency, setCurrency] = useState(
    CURRENCIES.includes(defaultCurrency) ? defaultCurrency : "GBP"
  );

  const mappedCount = Object.values(mappings).filter((v) => v > 0).length;
  const allMapped = mappedCount === playerNames.length;

  const handleMappingChange = (playerName: string, memberId: number) => {
    setMappings((prev) => ({
      ...prev,
      [playerName]: memberId,
    }));
  };

  const handleExport = () => {
    if (allMapped) {
      onExport(mappings, currency);
    }
  };

  const formatMemberName = (member: { first_name: string; last_name: string; email: string }) => {
    const name = `${member.first_name} ${member.last_name}`.trim();
    return `${name} (${member.email})`;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Map Players to Members</h2>
        <p className="text-gray-400">
          Match each player to a member in &quot;{group.name}&quot;
        </p>
      </div>

      <div className="w-full space-y-4">
        {playerNames.map((playerName) => (
          <div key={playerName} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">
              {playerName}
            </label>
            <select
              value={mappings[playerName] ?? ""}
              onChange={(e) =>
                handleMappingChange(playerName, Number(e.target.value) || 0)
              }
              className="w-full bg-gray-600 text-gray-100 p-2 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select member...</option>
              {group.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {formatMemberName(member)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="w-full">
        <label className="text-sm font-medium text-gray-300 block mb-1">
          Currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full bg-gray-600 text-gray-100 p-2 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-400">
        {mappedCount} of {playerNames.length} players mapped
      </div>

      <button
        onClick={handleExport}
        disabled={!allMapped}
        className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded transition-colors"
      >
        Export to Splitwise
      </button>
    </div>
  );
};

export default MemberMapping;
