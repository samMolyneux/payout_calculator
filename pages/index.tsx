import type React from "react";
import InputForm from "./home/InputForm";

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
