import React from "react";
import "./amountInput.scss";

const amountInput = ({ name, type, value, onChange, placeholder }) => {
  return (
    <div className="amount-input-wrapper">
      <label>Amount to withdraw</label>
      <input
        className="amount-input"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default amountInput;
