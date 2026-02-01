"use client";
import React from "react";
import { useState } from "react";
import { Player, Transaction } from "../../types/index";
import { convertToPounds } from "../../scripts/util";

import InputRow from "./InputRow";
import TransactionTable from "./TransactionTable";

const InputForm: React.FC<{}> = (props) => {
  let transactions: Transaction[] = new Array();
  const [ledger, setLedger] = useState<Player[]>([
    { name: "", id: 0, net: 0 } as Player,
  ]);
  const [output, setOutput] = useState<Transaction[]>([]);
  const [discrepancy, setDiscrepancy] = useState<number>();
  const [playerCount, setPlayerCount] = useState(1);
  const [calculated, setCalculated] = useState(false);
  const [evens, setEvens] = useState(false);
  const [error, setError] = useState(false);

  function addPlayer() {
    // console.log("playerName:", playerName, " net: ", net);
    // if (ledger.some((item) => item.name === playerName)) {
    //   console.log("NAME ALREADY ENTERED ERROR");
    //   return false;
    // }

    setLedger([...ledger, { id: playerCount, net: 0 } as Player]);
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
    setError(false);
  }

  function splitDiscrepancy() {
    if (!discrepancy) return;

    // Find all winners (players with positive net)
    let eligibleWinners = ledger.filter((player) => player.net > 0);

    if (eligibleWinners.length === 0) {
      // No winners to split among, cannot proceed
      console.log("No winners to split discrepancy among");
      setError(true);
      return;
    }

    // Iteratively remove winners who can't afford the split until we have a stable set
    let splitAmount = 0;
    let previousEligibleCount = 0;
    let iterations = 0;
    const maxIterations = ledger.length; // Can't remove more players than exist

    while (eligibleWinners.length > 0 && eligibleWinners.length !== previousEligibleCount) {
      previousEligibleCount = eligibleWinners.length;

      // Calculate how much each eligible winner would need to contribute (to nearest penny)
      splitAmount = Math.round(discrepancy / eligibleWinners.length);

      // Filter out winners who would go negative after this split
      eligibleWinners = eligibleWinners.filter((winner) => {
        return winner.net - splitAmount >= 0;
      });

      iterations++;
      if (iterations >= maxIterations) {
        // Infinite loop detected, something went wrong
        console.error("Max iterations reached in splitDiscrepancy, potential infinite loop");
        setError(true);
        return;
      }
    }

    if (eligibleWinners.length === 0) {
      // No eligible winners after iterative filtering, cannot proceed
      console.log("No eligible winners after filtering those who would go negative");
      setError(true);
      return;
    }

    // Final split amount (recalculate one more time with the final set)
    const finalSplitAmount = Math.round(discrepancy / eligibleWinners.length);

    // Create a new ledger with adjusted values
    const adjustedLedger = ledger.map((player) => {
      const isEligibleWinner = eligibleWinners.some((w) => w.id === player.id);
      if (isEligibleWinner) {
        return {
          ...player,
          net: player.net - finalSplitAmount,
        };
      }
      return player;
    });

    // Calculate the actual total adjustment (may differ slightly due to rounding)
    const totalAdjustment = finalSplitAmount * eligibleWinners.length;

    // If there's still a small discrepancy due to rounding, adjust the first eligible winner
    const remainingDiscrepancy = discrepancy - totalAdjustment;
    if (remainingDiscrepancy !== 0 && eligibleWinners.length > 0) {
      const firstWinnerIndex = adjustedLedger.findIndex(
        (p) => p.id === eligibleWinners[0].id
      );
      if (firstWinnerIndex !== -1) {
        adjustedLedger[firstWinnerIndex] = {
          ...adjustedLedger[firstWinnerIndex],
          net: adjustedLedger[firstWinnerIndex].net - remainingDiscrepancy,
        };
      }
    }

    // Update ledger with adjusted values
    setLedger(adjustedLedger);

    // Clear discrepancy and recalculate
    setDiscrepancy(undefined);
    calculate(adjustedLedger);
  }

  function calculate(players: Player[]) {
    console.log("current players: ");
    console.log(players);

    // Filter out empty rows (rows with no name or with empty name and zero net)
    const filteredPlayers = players.filter(player => {
      return player.name && player.name.trim() !== '';
    });

    // Update the ledger to remove empty rows
    setLedger(filteredPlayers);

    let sum = 0;
    let positives: Player[] = new Array();
    let negatives: Player[] = new Array();

    setCalculated(true);

    filteredPlayers.forEach((player) => {
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
            onClick={() => calculate(ledger)}
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

      {discrepancy && (
        <div className="flex flex-col items-center gap-2 my-2">
          <div className="flex bg-gray-700 p-1 rounded text-center justify-center w-80 text-red-500">
            {`Inputs do not sum to zero, calculated value is off by: ${convertToPounds(
              discrepancy
            )}`}
          </div>
          <button
            className="text-sm px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            onClick={() => splitDiscrepancy()}
          >
            Split Discrepancy
          </button>
        </div>
      )}

      {error && (
        <div className="flex bg-red-700 p-2 my-2 rounded text-center justify-center w-80">
          Something went wrong. Please check your inputs and try again.
        </div>
      )}
    </div>
  );
};
export default InputForm;
