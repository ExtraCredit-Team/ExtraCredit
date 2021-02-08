import React from "react";
import "./creditContent.scss";
import {BorrowerStatus} from "../../borrowerdashboard/BorrowerStatus.component";
import {BorrowerAssets} from "../../borrowerassets/BorrowerAssets.component";

const CreditContent = ({protocolProps}) => {
  return (
      <>
          <BorrowerStatus props={protocolProps}/>
          <BorrowerAssets props={protocolProps}/>
      </>
  );
};

export default CreditContent;
