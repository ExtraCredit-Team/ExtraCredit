import React from "react";
import "./borrowButton.scss";
const borrowButton = ({ onShow }) => {
  const handleClick = val => {
    onShow ? onShow() : console.log("borrow an amount");
  };
  return (
    <button className="borrow-button" onClick={() => handleClick()}>
      Borrow
    </button>
  );
};

export default borrowButton;
