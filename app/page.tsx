"use client";
import React from "react";
import InputForm from "./pages/home/InputForm";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* <div className="py-2"></div> */}
        <div className="text-2xl text-center">payout_calculator</div>
        {/* <div className="py-2 px-0"></div> */}
        <InputForm />
      </div>
      <footer className="w-full py-4 px-4 text-center text-sm text-gray-400 border-t border-gray-700">
        To get in touch, make a feature request, or report an issue please contact me here:{" "}
        <a
          href="mailto:mountwebservices@gmail.com"
          className="text-gray-300 hover:text-gray-100 underline transition-colors"
        >
          mountwebservices@gmail.com
        </a>
      </footer>
    </div>
  );
}
