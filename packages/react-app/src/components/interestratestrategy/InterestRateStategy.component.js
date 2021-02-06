import {formatEther} from "@ethersproject/units";
import React from "react";


export const InterestRatesStrategy = ({
                                          optimalUtilization,
                                          excessRate,
                                          baseStableRate,
                                          slope1StableRate,
                                          slope2StableRate,
                                          address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts
                                      }) => {

    return (
        <div>
            <div style={{border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64}}>

                <h2>Interest stats :</h2>
                <div>optimalUtilization : {optimalUtilization && formatEther(optimalUtilization)}</div>
                <div>excessRate : {excessRate && formatEther(excessRate)}</div>
                <div>baseStableRate : {baseStableRate && formatEther(baseStableRate)}</div>
                <div>slope1StableRate : {slope1StableRate && formatEther(slope1StableRate)}</div>
                <div>slope2StableRate : {slope2StableRate && formatEther(slope2StableRate)}</div>
            </div>
        </div>
    );

}
