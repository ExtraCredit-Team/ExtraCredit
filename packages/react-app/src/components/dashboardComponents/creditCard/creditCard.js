import React, { useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import daiLogo from "../../../images/multi-collateral-dai-dai-logo.svg";
import PositionInfo from "../positionInfo/positionInfo";
import RepayButton from "../repayButton/repayButton";
import "./creditCard.scss";

const CreditCard = ({ protocolProps, onShow }) => {
  console.log("🚀 ~ file: creditCard.js ~ line 9 ~ CreditCard ~ protocolProps", protocolProps);
  return (
    <div className="credit-card">
      <div className="img-cont">
        <img src={daiLogo} alt="daiLogo" className="deposited-dai-logo" />
      </div>
      <div className="deposited-content">
        <PositionInfo label="Amount:" value="" />
        <PositionInfo label="Interest earned:" value="" />
        <RepayButton onShow={onShow} />
      </div>
    </div>
  );
};

export default CreditCard;
