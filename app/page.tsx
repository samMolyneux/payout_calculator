"use client";
import React from "react";
import InputForm from "./pages/home/InputForm";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="flex-grow flex flex-col justify-center items-center w-full">
        {/* <div className="py-2"></div> */}
        <div className="text-2xl text-center">payout_calculator</div>
        <div className="py-2">
          <a
            href="https://buymeacoffee.com/mountweb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors inline-block"
          >
            Buy me a coffee
          </a>
        </div>
        {/* <div className="py-2 px-0"></div> */}
        <InputForm />
      </div>

      <footer className="w-full max-w-[768px] mx-auto py-4 px-4 text-center text-sm text-gray-400">
        <p>
          To get in touch, make a feature request, or report an issue please contact me here:{" "}
          <a
            href="mailto:mountwebservices@gmail.com"
            className="text-gray-300 hover:text-gray-100 underline decoration-gray-500 hover:decoration-gray-300 transition-colors duration-200"
          >
            mountwebservices@gmail.com
          </a>
        </p>
        <div className="mt-4">
          <a
            href="https://buymeacoffee.com/mountweb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-gray-100"
          >
            Buy me a coffee
          </a>
        </div>
      </footer>
    </div>
  );
}
