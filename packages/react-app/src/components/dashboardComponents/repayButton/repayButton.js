import React from "react";
import "./repayButton.scss";

const repayButton = ({ onShow }) => {
  return (
    <button className="repay-button" onClick={() => onShow()}>
      Repay
    </button>
  );
};

export default repayButton;
