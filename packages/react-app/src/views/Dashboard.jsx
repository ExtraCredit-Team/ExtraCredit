import React, { useState } from "react";
import DepositedPosition from "../components/dashboard/depositedPosition/depositedPosition";
import WithdrawModal from "../components/dashboard/withdrawModal/withdrawModal";

const Dashboard = () => {
  const [display, setDisplay] = useState(false);

  const onShow = () => {
    setDisplay(() => true);
  };
  const onClose = () => {
    setDisplay(() => false);
  };

  const onChange = () => {
    console.log("");
  };

  return (
    <div>
      <WithdrawModal display={display} onClose={onClose} onChange={onChange} />
      <DepositedPosition onShow={onShow} />
    </div>
  );
};

export default Dashboard;
