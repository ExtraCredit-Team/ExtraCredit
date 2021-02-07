import React from "react";
import "./withdrawButton.scss";

const withdrawButton = ({ onShow }) => {
  return (
    <button className="withdraw-button" onClick={() => onShow()}>
      Withdraw
    </button>
  );
};

export default withdrawButton;
