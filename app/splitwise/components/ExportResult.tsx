"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { ExportResponse } from "@/app/types/splitwise";

interface ExportResultProps {
  result: ExportResponse;
  onRetry: () => void;
}

const ExportResult: React.FC<ExportResultProps> = ({ result, onRetry }) => {
  const router = useRouter();

  if (result.success) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="text-green-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Export Successful</h2>
          <p className="text-gray-400">
            All debts have been added to Splitwise.
          </p>
        </div>

        <div className="flex gap-4">
          {result.groupUrl && (
            <a
              href={result.groupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Open in Splitwise
            </a>
          )}
          <button
            onClick={() => router.push("/")}
            className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Back to Calculator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-md">
      <div className="text-center">
        <div className="text-red-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Export Failed</h2>
        <p className="text-gray-400">
          The following debts could not be created:
        </p>
      </div>

      {result.failedDebts && result.failedDebts.length > 0 && (
        <div className="w-full bg-gray-700 rounded p-4 space-y-2">
          {result.failedDebts.map((debt, index) => (
            <div key={index} className="text-sm">
              <div className="text-gray-300">
                {debt.amount.toFixed(2)} - Error: {debt.error}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={onRetry}
          className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Back to Calculator
        </button>
      </div>
    </div>
  );
};

export default ExportResult;
