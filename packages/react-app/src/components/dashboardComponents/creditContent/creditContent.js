import React from "react";
import CreditCard from "../creditCard/creditCard";
import WithdrawModal from "../withdrawModal/withdrawModal";
import ProtocolCard from "../protocolCard/protocolCard";
import { formatEther } from "@ethersproject/units";
import "./creditContent.scss";

const CreditContent = ({ protocolProps, display, onShow, onClose }) => {
  console.log("🚀 ~ file: creditContent.js ~ line 8 ~ CreditContent ~ protocolProps", protocolProps);
  return (
    <div>
      <WithdrawModal display={display} onClose={onClose} protocolProps={protocolProps} />
      <div className="protocol-card-wrapper">
        <ProtocolCard
          title="Total borrowed"
          value={protocolProps.totalBorrowedAmount && formatEther(protocolProps.totalBorrowedAmount.toString())}
        />
      </div>
      {protocolProps.totalBorrowedAmount && formatEther(protocolProps.totalBorrowedAmount.toString()) ? (
        <CreditCard onShow={onShow} protocolProps={protocolProps} />
      ) : (
        ""
      )}
    </div>
  );
};

export default CreditContent;
