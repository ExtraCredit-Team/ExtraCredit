import React from "react";
import DepositCard from "../depositCard/depositCard";
import WithdrawModal from "../withdrawModal/withdrawModal";
import ProtocolCard from "../protocolCard/protocolCard";
import { formatEther } from "@ethersproject/units";
import "./depositContent.scss";

const DepositContent = ({ protocolProps, display, onShow, onClose }) => {
  return (
    <div>
      <WithdrawModal display={display} onClose={onClose} protocolProps={protocolProps} />
      <div className="protocol-card-wrapper">
        <ProtocolCard
          title="Total deposited"
          value={protocolProps.totalDeposit && formatEther(protocolProps.totalDeposit.toString())}
        />
        <ProtocolCard
          title="Total delegated"
          value={protocolProps.totalDelegation && formatEther(protocolProps.totalDelegation.toString())}
        />
      </div>
      {console.log("deposit -> ", protocolProps.totalDelegation && formatEther(protocolProps.totalDeposit.toString()))}
      {protocolProps.totalDelegation && formatEther(protocolProps.totalDeposit.toString()) ? (
        <DepositCard onShow={onShow} protocolProps={protocolProps} />
      ) : (
        <p>Go to Deposit section in order to deposit some amount, and start earning interest</p>
      )}
    </div>
  );
};

export default DepositContent;
