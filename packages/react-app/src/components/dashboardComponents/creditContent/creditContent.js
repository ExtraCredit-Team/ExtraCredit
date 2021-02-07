import React from "react";
import CreditCard from "../creditCard/creditCard";
import WithdrawModal from "../withdrawModal/withdrawModal";
import ProtocolCard from "../protocolCard/protocolCard";
import "./creditContent.scss";

const CreditContent = ({ display, onShow, onClose }) => {
  return (
    <div>
      <WithdrawModal display={display} onClose={onClose} />
      <div className="protocol-card-wrapper">
        <ProtocolCard title="Total deposited" value="200$" />
        <ProtocolCard title="Interest earned" value="200$" />
        <ProtocolCard title="% delegated" value="200$" />
      </div>
      <CreditCard onShow={onShow} />
    </div>
  );
};

export default CreditContent;
