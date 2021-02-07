import React, { useState } from "react";
import { formatEther, parseEther } from "@ethersproject/units";
import daiLogo from "../../../images/multi-collateral-dai-dai-logo.svg";
import PositionInfo from "../positionInfo/positionInfo";
import WithdrawButton from "../withdrawButton/withdrawButton";
import "./depositCard.scss";

const DepositCard = ({ protocolProps, onShow }) => {
  return (
    <div className="deposited-position">
      <div className="img-cont">
        <img src={daiLogo} alt="daiLogo" className="deposited-dai-logo" />
      </div>
      <div className="deposited-content">
        <PositionInfo
          label="Amount:"
          value={protocolProps.depositors && formatEther(protocolProps.depositors[1].toString())}
        />
        {/*<div className="postion-info">
          <p className="postion-info-label">Interest earned: </p>
          <p className="postion-info-label">
            <span className="text-success">
              0.9$ <i className="fa fa-arrow-up"></i>
            </span>
          </p>
  </div>*/}
        <PositionInfo
          label="Amount delegated:"
          value={protocolProps.depositors && formatEther(protocolProps.depositors[0].toString())}
        />
        <WithdrawButton onShow={onShow} protocolProps={protocolProps} />
      </div>
    </div>
  );
};

export default DepositCard;
