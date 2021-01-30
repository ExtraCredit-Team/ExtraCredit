import React from "react";
import "./withdrawButton.css";

const withdrawButton = ({ onShow }) => {
  return (
    <button className="withdraw-button" onClick={() => onShow()}>
      Withdraw
    </button>
  );
};

export default withdrawButton;
