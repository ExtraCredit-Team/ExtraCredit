import React from "react";
// reactstrap components
import {BorrowerAssets} from "../borrowerassets/BorrowerAssets.component";
import {BorrowerStatus} from "./BorrowerStatus.component";


export function BorrowerDashboard() {
    return <>
        <BorrowerStatus/>
        <BorrowerAssets/>
    </>
}
