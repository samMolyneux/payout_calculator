"use client";
import React, { useState } from "react";
import { Transaction } from "../../types/index";
import { convertToPounds } from "../../scripts/util";

const currencies = [
  { symbol: "£", label: "£ GBP" },
  { symbol: "$", label: "$ USD" },
  { symbol: "€", label: "€ EUR" },
  { symbol: "¥", label: "¥ JPY" },
  { symbol: "₹", label: "₹ INR" },
];

const TransactionTable: React.FC<{
  transactions: Transaction[];
}> = ({ transactions }) => {
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState("£");

  const formatForCopy = () => {
    const lines = transactions.map(
      (t) => `${t.from} pays ${t.to} ${currency}${convertToPounds(t.val)}`
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
      <table className="w-full">
        <thead>
          <tr className="text-gray-400 border-b border-gray-600">
            <th className="text-left py-1 px-2 font-normal">From</th>
            <th className="text-left py-1 px-2 font-normal">To</th>
            <th className="text-right py-1 px-2 font-normal">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.key} className="border-b border-gray-600 last:border-b-0">
              <td className="py-2 px-2">{transaction.from}</td>
              <td className="py-2 px-2">{transaction.to}</td>
              <td className="py-2 px-2 text-right">{currency}{convertToPounds(transaction.val)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center gap-2 mt-3">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="text-sm px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors cursor-pointer"
        >
          {currencies.map((c) => (
            <option key={c.symbol} value={c.symbol}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleCopy}
          className="p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
