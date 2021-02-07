import React, { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import AmountInput from "../amountInput/amountInput";
import RangeInput from "../rangeInput/rangeInput";
import WithdrawButton from "../withdrawButton/withdrawButton";
import "./withdrawModal.scss";

const WithdrawModal = props => {
  const [withdraw, setWithdraw] = useState({ withdraw: 0 });
  const { onClose, display } = props;
  const onChange = e => {
    setWithdraw({
      ...withdraw,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className={display ? "withdraw-modal" : "no-modal"}>
      <div className="withdraw-modal-back"></div>
      <div className="withdraw-container">
        <div className="withdraw-info">
          <div className="withdraw-close-wrapper">
            <button
              className="withdraw-close-btn"
              onClick={() => {
                onClose();
              }}
            >
              <CloseOutlined className="withdraw-x" />
            </button>
          </div>
          <div className="withdraw-info-title">
            <h3>Deposited</h3>
          </div>
          <div className="withdraw-info-content">
            <AmountInput name="withdraw" value={withdraw.withdraw} onChange={onChange} />
            <RangeInput name="withdraw" value={withdraw.withdraw} onChange={onChange} />
          </div>
          <div className="withdraw-btn-wrapper">
            <WithdrawButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
