import type React from "react";
import { useState } from "react";
import { calcNet as calcNet } from "../scripts/calcNet";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">payout_calculator</div>
      <div className="p-2"></div>
      <InputForm  />
    </div>
  );
}

const InputRow: React.FC<{
}> = (props) => {
  const [inVal, setInVal] = useState(0);
  const [outVal, setOutVal] = useState(0);
  return (
    <div className=" flex bg-gray-700 p-1 my-2 rounded">
      <input
        type="text"
        id="name"
        className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"
      ></input>
      <input
        type="number"
        id="inVal"
        name = "inVal"
        value={inVal}
        className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"
        onChange={e => setInVal(e.target.valueAsNumber)}
      ></input>
      <input
        type="number"
        id="outVal"
        value={outVal}
        className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"
        onChange={e => setOutVal(e.target.valueAsNumber)}
      ></input>

      <div id = "netVal" className=" bg-gray-400 rounded w-20 h-6 mx-1 px-2 text-gray-700">{outVal - inVal}</div>
    </div>
  );
};

const InputForm: React.FC<{
}> = (props) => {
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
      </div>

      {/* A player element */}
    
      <InputRow />
      <InputRow />
      <InputRow />
      <InputRow />
      <InputRow />
      <InputRow />
      <InputRow />
      <InputRow />
      <InputRow />
      

      <div className="p-2"></div>

      <button
        className="p-2 flex border bg-gray-600 font-medium rounded hover:font-bold active:text-gray-400 active: border-gray-400"
      >
        CALCULATE
      </button>
    </div>
  );
};
