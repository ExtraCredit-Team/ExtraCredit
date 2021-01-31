import React, { useState } from "react";
// reactstrap components
import { BorrowerAssets } from "../borrowerassets/BorrowerAssets.component";
import { BorrowerStatus } from "./BorrowerStatus.component";
import BorrowModal from "../borrowerassets/borrowModal/borrowModal";

export function BorrowerDashboard() {
  const [display, setDisplay] = useState(false);

  const onShow = () => {
    setDisplay(() => true);
  };
  const onClose = () => {
    setDisplay(() => false);
  };
  return (
    <>
      <BorrowModal display={display} onClose={onClose} />
      <BorrowerStatus />
      <BorrowerAssets onShow={onShow} />
    </>
  );
}
