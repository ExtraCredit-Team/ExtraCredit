import React from "react";
import CreditCard from "../creditCard/creditCard";
import WithdrawModal from "../withdrawModal/withdrawModal";
import ProtocolCard from "../protocolCard/protocolCard";
import { formatEther } from "@ethersproject/units";
import "./creditContent.scss";
import {BorrowerStatus} from "../../borrowerdashboard/BorrowerStatus.component";
import {BorrowerAssets} from "../../borrowerassets/BorrowerAssets.component";

const CreditContent = ({ protocolProps }) => {
  return (
      <>
          <BorrowerStatus props={protocolProps}/>
          <BorrowerAssets props={protocolProps}/>
      </>
  );
};

export default CreditContent;
