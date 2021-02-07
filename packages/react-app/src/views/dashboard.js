import React, { useState } from "react";
import "./dashboard.scss";
import DepositContent from "../components/dashboardComponents/depositContent/depositContent";
import CreditContent from "../components/dashboardComponents/creditContent/creditContent";

const Dashboard = props => {
  const [display, setDisplay] = useState(false);
  const [activeTab, setActiveTab] = useState("deposit");
  const onShow = () => {
    setDisplay(() => true);
  };
  const onClose = () => {
    setDisplay(() => false);
  };

  console.log("PROPS IN DASH -> ", props);

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
