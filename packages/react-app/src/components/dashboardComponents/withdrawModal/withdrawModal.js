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
    <div className={display ? "modal" : "no-modal"}>
      <div className="modal-back"></div>
      <div className="container">
        <div className="info">
          <div className="close-wrapper">
            <button
              className="close-btn"
              onClick={() => {
                onClose();
              }}
            >
              <CloseOutlined className="x" />
            </button>
          </div>
          <div className="info-title">
            <h3>Deposited</h3>
          </div>
          <div className="info-content">
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
