import React from "react";
import "./depositContent.scss";
import {DepositStatus} from "../../depositasset/DepositStatus.component";

const DepositContent = ({ protocolProps, display, onShow, onClose }) => {
  return (
      <DepositStatus onShow={onShow} onClose={onClose} protocolProps={protocolProps}/>
  );
};

export default DepositContent;
