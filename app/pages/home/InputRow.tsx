"use client";
import React from "react";
import { useState } from "react";
import { convertToPence } from "../../scripts/util";

const InputRow: React.FC<{
  addPlayer: (name: string, net: number) => boolean;
}> = (props) => {
  const [inVal, setInVal] = useState(0);
  const [outVal, setOutVal] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [locked, setLocked] = useState(false);

  function buttonClick(name: string, net: number, currState: boolean): boolean {
    return props.addPlayer(name, net);
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
        {convertToPence(outVal - inVal) / 100}
      </div>

      <button
        className="p-2 flex border bg-gray-600 font-medium rounded hover:font-bold active:text-gray-400 active: border-gray-400 disabled:bg-gray-700 disabled:border-none"
        onClick={(e) => {
          setLocked(
            buttonClick(playerName, convertToPence(outVal - inVal), locked)
          );
          console.log("player added");
        }}
        disabled={locked}
      >
        {locked ? "Confirmed" : "Add Player"}
      </button>
    </div>
  );
};

export default InputRow;
