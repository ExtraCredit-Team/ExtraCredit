import React from "react";
import DepositCard from "../depositCard/depositCard";
import WithdrawModal from "../withdrawModal/withdrawModal";
import ProtocolCard from "../protocolCard/protocolCard";
import { formatEther } from "@ethersproject/units";
import "./depositContent.scss";
import {DepositStatus} from "../../depositasset/DepositStatus.component";

const DepositContent = ({ protocolProps, display, onShow, onClose }) => {
  return (
      <DepositStatus onShow={onShow} onClose={onClose} protocolProps={protocolProps}/>
  );
};

export default DepositContent;
