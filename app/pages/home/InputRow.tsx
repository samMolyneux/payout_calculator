"use client";
import React from "react";
import { useState } from "react";
import { convertToPence, convertToPounds } from "../../scripts/util";
import { Player } from "@/app/types";

const InputRow: React.FC<{
  player: Player;
  onChange: (newVal: Player) => void;
  locked: boolean;
}> = (props) => {
  const [inVal, setInVal] = useState(0);
  const [outVal, setOutVal] = useState(0);
  const { locked } = props;
  function onNetChange(inVal: number, outVal: number) {
    const newNet = convertToPence(outVal - inVal);
    props.onChange({ ...props.player, net: newNet });
  }
  function onInValChange(newInVal: number) {
    setInVal(newInVal);
    onNetChange(newInVal, outVal);
  }
  function onOutValChange(newOutVal: number) {
    setOutVal(newOutVal);
    onNetChange(inVal, newOutVal);
  }

  return (
    <>
      <div
        className={`flex bg-gray-700 p-1 my-2 rounded  ${
          props.player.invalid && " outline outline-red-500"
        } `}
      >
        <input
          type="text"
          id={`playerName-${props.player.id}`}
          className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1 disabled:bg-gray-700"
          value={props.player.name || ""}
          onChange={(e) => {
            props.onChange({ ...props.player, name: e.target.value });
          }}
          disabled={locked}
        ></input>
        <input
          type="number"
          id={`inVal-${props.player.id}`}
          name="inVal"
          step="0.01"
          value={isNaN(inVal) ? "" : inVal}
          className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1 disabled:bg-gray-700"
          onChange={(e) => onInValChange(e.target.valueAsNumber)}
          disabled={locked}
        ></input>
        <input
          type="number"
          id={`outVal-${props.player.id}`}
          step="0.01"
          value={isNaN(outVal) ? "" : outVal}
          className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1 disabled:bg-gray-700"
          onChange={(e) => onOutValChange(e.target.valueAsNumber)}
          disabled={locked}
        ></input>

        <div
          id="netVal"
          className=" bg-gray-400 rounded w-20 h-6 mx-1 px-2 text-gray-700"
        >
          {props.player.net ? convertToPounds(props.player.net) : null}
        </div>
        {/* <button
          className="p-2 content-center flex border bg-gray-600 font-medium rounded hover:font-bold active:text-gray-400 active: border-gray-400 disabled:bg-gray-700 disabled:border-none"
          onClick={(e) => {
            setLocked(!locked);
            console.log("player added");
          }}
        >
          {locked ? "Unlock Player" : "Lock Player"}
        </button> */}
      </div>
      {props.player.invalid && (
        <div className="text-red-500">Name value must be unique</div>
      )}
    </>
  );
};

export default InputRow;
