import React, { useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import daiLogo from "../../../images/multi-collateral-dai-dai-logo.svg";
import PositionInfo from "../positionInfo/positionInfo";
import RepayButton from "../repayButton/repayButton";
import "./creditCard.scss";

const CreditCard = ({ onShow }) => {
  return (
    <div className="credit-card">
      <div className="img-cont">
        <img src={daiLogo} alt="daiLogo" className="deposited-dai-logo" />
      </div>
      <div className="deposited-content">
        <PositionInfo label="Amount:" value="200$" />
        <div className="postion-info">
          <p className="postion-info-label">Interest earned: </p>
          <p className="postion-info-label">
            <span className="text-success">
              0.9$ <i className="fa fa-arrow-up"></i>
            </span>
          </p>
        </div>
        <PositionInfo label="Interest earned:" value="0.9" />
        <RepayButton onShow={onShow} />
      </div>
    </div>
  );
};

export default CreditCard;
