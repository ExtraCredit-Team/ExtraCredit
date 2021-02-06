import React, { useState } from "react";
import "./dashboard.scss";
import DepositContent from "../components/dashboard/depositContent/despositContent";
import CreditContent from "../components/dashboard/creditContent/creditContent";

const Dashboard = () => {
  const [display, setDisplay] = useState(false);
  const [activeTab, setActiveTab] = useState("deposit");
  const onShow = () => {
    setDisplay(() => true);
  };
  const onClose = () => {
    setDisplay(() => false);
  };

  return (
    <div>
      <div className="tab-selector">
        <span onClick={() => setActiveTab("deposit")} className={activeTab === "deposit" ? "tab-active" : "tab"}>
          My deposits
        </span>
        <span onClick={() => setActiveTab("credit")} className={activeTab === "credit" ? "tab-active" : "tab"}>
          My credits
        </span>
      </div>
      {activeTab === "deposit" ? (
        <DepositContent display={display} onShow={onShow} onClose={onClose} />
      ) : (
        <CreditContent display={display} onShow={onShow} onClose={onClose} />
      )}
    </div>
  );
};

export default Dashboard;
