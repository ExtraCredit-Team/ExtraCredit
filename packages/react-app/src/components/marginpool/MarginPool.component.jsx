/* eslint-disable jsx-a11y/accessible-emoji */

import React, {useState} from "react";
import {Button, Divider, Input} from "antd";
import {Address} from "../../components";
import {parseEther} from "@ethersproject/units";
import marginPoolAddress from "../../contracts/MarginPool.address"
import {FormGroup, Label} from "reactstrap";


export default function MarginPool({
                                       delegateeDeposits,
                                       IERC20Contract,
                                       minSolvencyRatio,
                                       totalBorrowedAmount,
                                       aaveLendingPool,
                                       address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts
                                   }) {

    const [amountToInvest, setNewAmountToInvest] = useState("loading...");
    const [marginAmount, setmarginAmount] = useState("loading...");
    const [investDuration, setInvestDuration] = useState(1);
    const [amountToDelegate, setNewAmountToDelegate] = useState("loading...");
    const [daiAmountBorrowed, setdaiAmountBorrowed] = useState("loading...");

    return (
        <div>
            {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
            <div style={{border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64}}>

                <h2>First Step : Borrow some DAI from AAVE:</h2>

                <div style={{margin: 8}}>
                    <Input onChange={(e) => {
                        setdaiAmountBorrowed(e.target.value)
                    }}/>
                    <Button onClick={() => {
                        let daiToken = "0x6b175474e89094c44da98b954eedeac495271d0f";
                        tx(aaveLendingPool.borrow(daiToken, parseEther(daiAmountBorrowed), 1, 0, address))
                    }}>Borrow DAI</Button>
                </div>

                <Divider/>

                <div><strong>Invest credit loans into Vaults</strong></div>
                <div>minSolvencyRatio: {minSolvencyRatio && minSolvencyRatio.toString()}</div>

                <Divider/>

                <div>totalBorrowedAmount: {totalBorrowedAmount && totalBorrowedAmount.toString()}</div>

                <Divider/>

                <div>delegateeDeposits: {delegateeDeposits && delegateeDeposits[0].toString()}</div>

                <Divider/>

                <div style={{margin: 8}}>
                    <div>Amount to invest in Yearn Vault</div>
                    <Input onChange={(e) => {
                        setNewAmountToInvest(e.target.value)
                    }}/>
                    <div>Margin Amount to add</div>
                    <Input onChange={(e) => {
                        setmarginAmount(e.target.value)
                    }}/>

                    <FormGroup>
                        <Label for="exampleRange">Invest duration</Label>
                        <Input defaultValue={investDuration} min="1" max="4" step="1"
                               onChange={(e) => setInvestDuration(e.target.value)} type="range" name="range"
                               id="exampleRange"/>
                        Weeks : {investDuration}
                    </FormGroup>
                    <Button disabled={!marginAmount} onClick={async () => {
                        /* look how you call setDeposit on your contract: */
                        let amount = 10;
                        let daiToken = "0x6b175474e89094c44da98b954eedeac495271d0f";
                        let wethAsset = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
                        let debtToken = "0x778A13D3eeb110A4f7bb6529F99c000119a08E92";
                        console.log("investDuration", investDuration);
                        console.log("amountToInvest", amountToInvest);
                        await tx(IERC20Contract.approve(readContracts.MarginPool.address, parseEther("10")));
                        await tx(writeContracts.MarginPool.invest(parseEther("1"), daiToken, parseEther(marginAmount), parseEther("1"), investDuration))
                    }}>Invest</Button>
                </div>


                <Divider/>

                <div style={{margin: 8}}>
                    <div>Repay investment</div>
                    <Input onChange={(e) => {
                        setNewAmountToInvest(e.target.value)
                    }}/>
                    <div>Margin Amount to add</div>
                    <Input onChange={(e) => {
                        setmarginAmount(e.target.value)
                    }}/>

                    <FormGroup>
                        <Label for="exampleRange">Invest duration</Label>
                        <Input defaultValue={investDuration} min="1" max="4" step="1"
                               onChange={(e) => setInvestDuration(e.target.value)} type="range" name="range"
                               id="exampleRange"/>
                        Weeks : {investDuration}
                    </FormGroup>
                    <Button onClick={() => {
                        /* look how you call setDeposit on your contract: */
                        let amount = 10;
                        let daiToken = "0x6b175474e89094c44da98b954eedeac495271d0f";
                        let debtToken = "0x778A13D3eeb110A4f7bb6529F99c000119a08E92";
                        console.log("amountToInvest", parseEther(amountToInvest));
                        console.log("amountToDelegate", parseEther(amountToDelegate));
                        console.log("marginPoolAddress:", marginPoolAddress);
                        console.log(typeof marginPoolAddress);
                        tx(writeContracts.MarginPool.repay(daiToken, daiToken, parseEther(marginAmount), parseEther(amountToDelegate), investDuration))
                    }}>Invest</Button>
                </div>

                Your Address:
                <Address
                    value={address}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                />

                <Divider/>

                Your Contract Address:
                <Address
                    value={readContracts ? readContracts.MarginPool.address : readContracts}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                />

            </div>
        </div>
    );
}
