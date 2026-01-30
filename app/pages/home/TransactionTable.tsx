"use client";
import React, { useState } from "react";
import { Transaction } from "../../types/index";
import { convertToPounds } from "../../scripts/util";

const TransactionTable: React.FC<{
  transactions: Transaction[];
}> = ({ transactions }) => {
  const [copied, setCopied] = useState(false);

  const formatForCopy = () => {
    const lines = transactions.map(
      (t) => `${t.from} pays ${t.to} £${convertToPounds(t.val)}`
    );
    return `Payouts:\n${lines.join("\n")}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatForCopy());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-700 rounded p-3 my-2 w-full max-w-md">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-600">
            <th className="text-left py-1 px-2">From</th>
            <th className="text-left py-1 px-2">To</th>
            <th className="text-right py-1 px-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.key} className="border-b border-gray-600 last:border-b-0">
              <td className="py-2 px-2">{transaction.from}</td>
              <td className="py-2 px-2">{transaction.to}</td>
              <td className="py-2 px-2 text-right">£{convertToPounds(transaction.val)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-3">
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
