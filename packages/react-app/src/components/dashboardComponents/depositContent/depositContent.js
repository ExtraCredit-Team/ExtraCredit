import React from "react";
import DepositCard from "../depositCard/depositCard";
import WithdrawModal from "../withdrawModal/withdrawModal";
import ProtocolCard from "../protocolCard/protocolCard";
import "./depositContent.scss";

const DepositContent = ({ display, onShow, onClose }) => {
  return (
    <div>
      <WithdrawModal display={display} onClose={onClose} />
      <div className="protocol-card-wrapper">
        <ProtocolCard title="Total deposited" value="200$" />
        <ProtocolCard title="Interest earned" value="200$" />
        <ProtocolCard title="% delegated" value="200$" />
      </div>
      <DepositCard onShow={onShow} />
    </div>
  );
};

export default DepositContent;
