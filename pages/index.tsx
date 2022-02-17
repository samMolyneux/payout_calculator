import type React from "react";
import { useState } from "react";
import { calcNet as calcNet } from "../scripts/calcNet";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">payout_calculator</div>
      <div className="p-2"></div>
      <InputForm />
    </div>
  );
}

const InputForm: React.FC<{}> = (props) => {
  const testVal = 0;

  let ledger: { [name: string]: number } = {};

  function addPlayer(playerName: string, net: number) {
    console.log("playerName:", playerName, " net: ", net);

    ledger[playerName] = net;

    console.log(ledger);
  }

  function calculate(ledger: { [name: string]: number }) {
    let sum = 0;
    let positives: { [name: string]: number } = {};
    let negatives: { [name: string]: number } = {};

    for (const [key, value] of Object.entries(ledger)) {
      console.log(key, value);
      sum = sum + value;

      if (value > 0) {
        positives[key] = value;
      } else if (value < 0) {
        negatives[key] = value;
      } else {
        console.log("evens");
        return;
      }
    }

    for (const [key, value] of Object.entries(positives).sort((a, b) => b[1] - a[1])) {
      //check
      let mostNeg = Object.entries(negatives).sort((a, b) => b[1] - a[1])[0];


    }


    if (sum != 0) {
      console.log("INVALID INPUT: entries do not sum to zero");
      return;
    }
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
        CALCULATE
      </button>
    </div>
  );
};

const InputRow: React.FC<{
  addPlayer: (name: string, net: number) => void;
}> = (props) => {
  const [inVal, setInVal] = useState(0);
  const [outVal, setOutVal] = useState(0);
  const [playerName, setPlayerName] = useState("");

  return (
    <div className=" flex bg-gray-700 p-1 my-2 rounded items-center">
      <input
        type="text"
        id="playerName"
        className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"
        onChange={(e) => setPlayerName(e.target.value)}
      ></input>
      <input
        type="number"
        id="inVal"
        name="inVal"
        value={inVal}
        className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"
        onChange={(e) => setInVal(e.target.valueAsNumber)}
      ></input>
      <input
        type="number"
        id="outVal"
        value={outVal}
        className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"
        onChange={(e) => setOutVal(e.target.valueAsNumber)}
      ></input>

      <div
        id="netVal"
        className=" bg-gray-400 rounded w-20 h-6 mx-1 px-2 text-gray-700"
      >
        {outVal - inVal}
      </div>

      <button
        className="p-2 flex border bg-gray-600 font-medium rounded hover:font-bold active:text-gray-400 active: border-gray-400 "
        onClick={(e) => props.addPlayer(playerName, outVal - inVal)}
      >
        Add Player
      </button>
    </div>
  );
};
