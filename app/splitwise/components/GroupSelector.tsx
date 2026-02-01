"use client";

import React, { useState } from "react";
import type { SplitwiseGroup } from "@/app/types/splitwise";

interface GroupSelectorProps {
  groups: SplitwiseGroup[];
  onSelect: (group: SplitwiseGroup) => void;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({ groups, onSelect }) => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const handleContinue = () => {
    if (selectedGroup) {
      onSelect(selectedGroup);
    }
  };

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Groups Found</h2>
          <p className="text-gray-400">
            You don&apos;t have any groups in Splitwise. Please create a group first.
          </p>
        </div>
        <a
          href="https://www.splitwise.com/groups/new"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Create a Group in Splitwise
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Select a Group</h2>
        <p className="text-gray-400">
          Choose which Splitwise group to export the debts to.
        </p>
      </div>

      <div className="w-full">
        <select
          value={selectedGroupId ?? ""}
          onChange={(e) => setSelectedGroupId(Number(e.target.value) || null)}
          className="w-full bg-gray-600 text-gray-100 p-3 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select a group...</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name} ({group.members.length} members)
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedGroup}
        className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded transition-colors"
      >
        Continue
      </button>
    </div>
  );
};

export default GroupSelector;
