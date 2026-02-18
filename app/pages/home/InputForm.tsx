"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { Player, Transaction, Adjustment } from "../../types/index";
import { convertToPounds } from "../../scripts/util";
import { splitDiscrepancy, applyAdjustments } from "../../scripts/discrepancyUtils";

import InputRow from "./InputRow";
import TransactionTable from "./TransactionTable";

const InputForm: React.FC<{}> = (props) => {
  let transactions: Transaction[] = new Array();
  const [ledger, setLedger] = useState<Player[]>([
    { name: "", id: 0, net: 0, inVal: 0 } as Player,
  ]);
  const [output, setOutput] = useState<Transaction[]>([]);
  const [discrepancy, setDiscrepancy] = useState<number>();
  const [playerCount, setPlayerCount] = useState(1);
  const [calculated, setCalculated] = useState(false);
  const [evens, setEvens] = useState(false);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [splitError, setSplitError] = useState<string | null>(null);

  function addPlayer() {

    setLedger([...ledger, { id: playerCount, net: 0, inVal: 0 } as Player]);
    setPlayerCount(playerCount + 1);
    return true;
  }

  const checkDuplicateName = (name: string, id: number) => {
    console.log(`new name: ${name}`);
    console.log(ledger);
    console.log(
      ledger.some((player) => {
        player.name === name;
      })
    );
    return ledger.some((player) => player.name === name && player.id != id);
  };

  const setPlayer = (index: number, newVal: Player) => {
    const validatedVal = {
      ...newVal,
      invalid: checkDuplicateName(newVal.name, newVal.id),
    };
    const newLedger = ledger.map((player, i) => {
      if (i === index) {
        return validatedVal;
      } else {
        // The rest haven't changed
        return player;
      }
    });
    setLedger(newLedger);
  };

  function refresh() {
    setCalculated(false);
    setOutput([]);
    setDiscrepancy(undefined);
    setEvens(false);
    setAdjustments([]);
    setSplitError(null);
  }

  function calculate(players: Player[]) {
    let sum = 0;
    let positives: Player[] = new Array();
    let negatives: Player[] = new Array();

    setCalculated(true);

    players.forEach((player) => {
      sum = sum + player.net;
      if (player.net > 0) {
        positives.push({ ...player });
      } else if (player.net < 0) {
        negatives.push({ ...player });
      } else {
        console.log("evens");
        return;
      }
    });

    if (sum != 0) {
      console.log(
        "INVALID INPUT: entries do not sum to zero\n actual sum:  ",
        sum
      );
      setDiscrepancy(sum);
      transactions.forEach((element) => {
        transactions.pop();
      });
      return;
    }
    while (negatives.length != 0) {
      positives = positives.sort((a, b) => b.net - a.net);
      positives.forEach((curr) => {
        let source = negatives.sort((a, b) => a.net - b.net)[0];

        let sourceVal = Math.abs(source.net);
        let destVal = curr.net;
        let transactionVal = Math.min(sourceVal, destVal);
        if (sourceVal == destVal) {
          positives = positives.filter((player) => player !== curr);
          negatives = negatives.filter((player) => player !== source);
        } else if (sourceVal > destVal) {
          positives = positives.filter((player) => player !== curr);
          source.net = source.net + transactionVal;
        } else {
          negatives = negatives.filter((player) => player !== source);
          curr.net = curr.net - transactionVal;
        }

        transactions.push({
          from: source.name,
          to: curr.name,
          val: transactionVal,
          key: source.name + curr.name + transactionVal.toString(),
        });
        console.log(
          "Transactions: ",
          transactions,
          "\n positives: ",
          positives,
          "\n negatives: ",
          negatives
        );
      });
    }
    if (transactions.length == 0) {
      setEvens(true);
    } else {
      setOutput(transactions);
    }
    console.log("Transactions: ", transactions);
  }

  function handleSplitDiscrepancy() {
    if (!discrepancy) return;

    const result = splitDiscrepancy(ledger, discrepancy);

    if (!result.success) {
      setSplitError(result.error || "Failed to split discrepancy");
      return;
    }

    setSplitError(null);
    setAdjustments(result.adjustments);

    // Apply adjustments and recalculate transactions
    const adjustedPlayers = applyAdjustments(ledger, result.adjustments);
    setDiscrepancy(undefined);
    calculate(adjustedPlayers);
  }

  function handleCalculate(players: Player[]) {
    console.log("current players: ");
    console.log(players);

    // Filter out empty rows (rows with no name or with empty name and zero net)
    const filteredPlayers = players.filter(player => {
      return player.name && player.name.trim() !== '';
    });

    // Update the ledger to remove empty rows
    setLedger(filteredPlayers);
    calculate(filteredPlayers);

  }
  return (
    <div className="flex flex-col justify-center items-center">
      {/* labels */}
      <div className=" flex p-1 my-1 rounded">
        <div className=" flex p-2 text-gray-400 rounded w-20 h-6 mx-1 justify-center">
          Name
        </div>
        <div className=" flex p-2 text-gray-400 rounded w-20 h-6 mx-1 justify-center">
          In
        </div>
        <div className=" flex p-2 text-gray-400 rounded w-20 h-6 mx-1 justify-center">
          Out
        </div>
        <div className=" flex p-2 text-gray-400 rounded w-20 h-6 mx-1 justify-center">
          Net
        </div>
      </div>

      {ledger.map((player, index) => (
        <InputRow
          key={player.id}
          player={player}
          onChange={(newVal) => setPlayer(index, newVal)}
          locked={calculated}
        ></InputRow>
      ))}

      {!calculated && (
        <button
          className="w-8 h-8 flex items-center justify-center text-sm bg-gray-600 hover:bg-gray-500 rounded transition-colors"
          onClick={() => addPlayer()}
        >
          +
        </button>
      )}
      <div className="py-2">
        {calculated ? (
          <button
            className="text-sm px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            onClick={() => refresh()}
          >
            Edit
          </button>
        ) : (
          <button
            className="text-sm px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            onClick={() => handleCalculate(ledger)}
          >
            Calculate
          </button>
        )}
      </div>

      <TransactionTable transactions={output} />

      {evens && !discrepancy && (
        <div className=" flex bg-gray-700 p-1 my-2 rounded text-center justify-center w-80">
          Evens, no transactions required.
        </div>
      )}

      {adjustments.length > 0 && (
        <div className="text-sm my-2">
          <div>Adjustments made</div>
          {Object.entries(
            adjustments.reduce((acc, adj) => {
              const key = adj.amount;
              if (!acc[key]) acc[key] = [];
              acc[key].push(adj.playerName);
              return acc;
            }, {} as Record<number, string[]>)
          ).map(([amount, players], idx) => (
            <div key={idx}>
              {Number(amount) > 0 ? '+' : ''}{convertToPounds(Number(amount))}: {players.join(", ")}
            </div>
          ))}
        </div>
      )}

      {discrepancy && (
        <div className="flex flex-col items-center gap-2 my-2">
          <div className="flex bg-gray-700 p-1 rounded text-center justify-center w-80 text-red-400">
            {discrepancy > 0
              ? `There is a shortfall of ${convertToPounds(discrepancy)}`
              : `There is a surplus of ${convertToPounds(Math.abs(discrepancy))}`}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-sm px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
              onClick={() => handleSplitDiscrepancy()}
            >
              Split the discrepancy
            </button>
            <Link
              href="/split-the-discrepancy"
              target="_blank"
              className="text-gray-400 hover:text-gray-300 transition-colors"
              title="Learn more"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          {splitError && (
            <div className="text-red-400 text-sm">{splitError}</div>
          )}
        </div>
      )}

    </div>
  );
};
export default InputForm;
