import React, { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import BorrowInput from "../borrowInput/amountInput";
import RangeInput from "../../dashboard/rangeInput/rangeInput";
import BorrowButton from "../borrowButton/borrowButton";
import "./borrowModal.scss";

const BorrowModal = props => {
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
            <h3>Borrow</h3>
          </div>
          <div className="info-content">
            <BorrowInput name="withdraw" value={withdraw.withdraw} onChange={onChange} />
            <RangeInput name="withdraw" value={withdraw.withdraw} onChange={onChange} />
          </div>
          <div className="withdraw-btn-wrapper">
            <BorrowButton onShow={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowModal;
