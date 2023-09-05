import type React from "react";
import { useState } from "react";

export default function Home() {
  return (
    
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      {/* <div className="py-2"></div> */}
      <div className="text-2xl text-center">payout_calculator</div>
      {/* <div className="py-2 px-0"></div> */}
      <InputForm />
    </div>
  );
}

interface Player {
  name: string;
  net: number;
}

interface Transaction {
  from: string;
  to: string;
  val: number;
  key: string;
}

const InputForm: React.FC<{}> = (props) => {
  
  let transactions: Transaction[] = new Array();
  const [ledger, setLedger] = useState<Player[]>([]);
  const [output, setOutput] = useState<Transaction[]>([]);

  function addPlayer(playerName: string, net: number) {
    console.log("playerName:", playerName, " net: ", net);
    
    ledger.push({ name: playerName, net: net });
    
    setLedger(ledger);

    console.log(`current state: ${ledger}`);
  }

  function calculate(players: Player[]) {
    console.log("current players: ");
    console.log(players);
    let sum = 0;
    let positives: Player[] = new Array();
    let negatives: Player[] = new Array();

    players.forEach((player) => {
      sum = sum + player.net;
      if (player.net > 0) {
        positives.push({ name: player.name, net: player.net });
      } else if (player.net < 0) {
        negatives.push({ name: player.name, net: player.net });
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
    setOutput(transactions);
    console.log("Transactions: ", transactions);
  }
  return (
    <div className="flex flex-col justify-center items-center">
      {/* labels */}
      <div className=" flex p-1 my-1 rounded">
        <div className=" flex p-2 text-gray-600 rounded w-20 h-6 mx-1 justify-center">
          Name
        </div>
        <div className=" flex p-2 text-gray-600 rounded w-20 h-6 mx-1 justify-center">
          In
        </div>
        <div className=" flex p-2 text-gray-600 rounded w-20 h-6 mx-1 justify-center">
          Out
        </div>
        <div className=" flex p-2 text-gray-600 rounded w-20 h-6 mx-1 justify-center">
          Net
        </div>
        <div className="flex w-20 h-6 mx-1 p-2 justify-center"></div>
      </div>

      {/* A player element */}

      <InputRow addPlayer={addPlayer} />
      <InputRow addPlayer={addPlayer} />
      <InputRow addPlayer={addPlayer} />
      <InputRow addPlayer={addPlayer} />
      <InputRow addPlayer={addPlayer} />
      <InputRow addPlayer={addPlayer} />
      <InputRow addPlayer={addPlayer} />
      <InputRow addPlayer={addPlayer} />
      <InputRow addPlayer={addPlayer} />

      <div className="p-2"></div>

      <button
        className="p-2 flex border bg-gray-600 font-medium rounded hover:font-bold active:text-gray-400 active: border-gray-400"
        onClick={() => calculate(ledger)}
      >
        Calculate
      </button>
      <div className="p-2 items-center">{transactions.length?"Simplified Transactions:":""}</div>
      <div className="flex flex-col w-full max-w-2xl">
      
        
        {output.map((transaction) => {
          return (
            <TransactionRow key={transaction.key} transaction={transaction} />
          );
        })}
      </div>
    </div>
  );
};

const InputRow: React.FC<{
  addPlayer: (name: string, net: number) => void;
}> = (props) => {
  const [inVal, setInVal] = useState(0);
  const [outVal, setOutVal] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [locked, setLocked] = useState(false);

  function buttonClick(name: string, net: number, currState: boolean): boolean {
    props.addPlayer(name, net);
    return true;
  }

  return (
    <div className=" flex bg-gray-700 p-1 my-2 rounded items-center">
      <input
        type="text"
        id="playerName"
        className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1 disabled:bg-gray-700"
        onChange={(e) => setPlayerName(e.target.value)}
        disabled={locked}
      ></input>
      <input
        type="number"
        id="inVal"
        name="inVal"
        step="0.01"
        value={inVal}
        className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1 disabled:bg-gray-700"
        onChange={(e) => setInVal(e.target.valueAsNumber)}
        disabled={locked}
      ></input>
      <input
        type="number"
        id="outVal"
        step="0.01"
        value={outVal}
        className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1 disabled:bg-gray-700"
        onChange={(e) => setOutVal(e.target.valueAsNumber)}
        disabled={locked}
      ></input>

      <div
        id="netVal"
        className=" bg-gray-400 rounded w-20 h-6 mx-1 px-2 text-gray-700"
      >
        {Math.round((outVal - inVal) * 100) / 100}
      </div>

      <button
        className="p-2 flex border bg-gray-600 font-medium rounded hover:font-bold active:text-gray-400 active: border-gray-400 disabled:bg-gray-700 disabled:border-none"
        onClick={(e) => {
          setLocked(
            buttonClick(playerName, Math.round((outVal - inVal) * 100), locked)
          );
        }}
        disabled = {locked}
      >
        {locked?"Confirmed":"Add Player"}
      </button>
    </div>
  );
};

const TransactionRow: React.FC<{
  transaction: Transaction;
  key: string;
}> = (props) => {
  return (
    <div className=" flex bg-gray-700 p-1 my-2 rounded items-center h-6">
      <div className=" flex ">From: {props.transaction.from}</div>
      <div className=" flex  p-2">To: {props.transaction.to}</div>
      <div className=" flex  p-2">
        Amount: £{Number(props.transaction.val / 100).toFixed(2)}
      </div>
    </div>
  );
};
