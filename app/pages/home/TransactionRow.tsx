"use client";
import React from "react";
import { Transaction } from "../../types/index";
import { convertToPence, convertToPounds } from "../../scripts/util";

const TransactionRow: React.FC<{
  transaction: Transaction;
  key: string;
}> = (props) => {
  return (
    <div className=" flex bg-gray-700 p-1 my-2 rounded items-center">
      <div className=" flex ">From: {props.transaction.from}</div>
      <div className=" flex  p-2">To: {props.transaction.to}</div>
      <div className=" flex  p-2">
        Amount: £{convertToPounds(props.transaction.val)}
      </div>
    </div>
  );
};
export default TransactionRow;
