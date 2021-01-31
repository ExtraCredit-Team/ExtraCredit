import React, { useState } from "react";
import DepositedPosition from "../components/dashboard/depositedPosition/depositedPosition";
import WithdrawModal from "../components/dashboard/withdrawModal/withdrawModal";
import { Col, Row } from "reactstrap";
import ProtocolCard from "../components/dashboard/protocolCard/protocolCard";

const Dashboard = () => {
  const [display, setDisplay] = useState(false);

  const onShow = () => {
    setDisplay(() => true);
  };
  const onClose = () => {
    setDisplay(() => false);
  };

  return (
    <div>
      <WithdrawModal display={display} onClose={onClose} />
      <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0" }}>
        <ProtocolCard title="Total deposited" value="200$" />
        <ProtocolCard title="Interest earned" value="200$" />
        <ProtocolCard title="% delegated" value="200$" />
      </div>
      <DepositedPosition onShow={onShow} />
    </div>
  );
};

export default Dashboard;
