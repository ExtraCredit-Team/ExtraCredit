/* eslint-disable jsx-a11y/accessible-emoji */

import React, {useState} from "react";
import {Button, Divider, Input, List} from "antd";
import {Address, Balance} from "../index";
import {formatEther, parseEther} from "@ethersproject/units";
import marginPoolAddress from "../../contracts/MarginPool.address"

export default function CreditPool({
                                       mainnetWETHAaveContract,
                                       totalDelegation,
                                       depositors,
                                       aWethContract,
                                       setDepositEvent,
                                       aaveLendingPool,
                                       totalDeposit, address, mainnetProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts
                                   }) {

    const [amountToDeposit, setNewAmountToDeposit] = useState("loading...");
    const [ethAmountToDepositToAave, setethAmountToDepositToAave] = useState("loading...")
    const [amountToDelegate, setNewAmountToDelegate] = useState("loading...");
    const [daiAmountBorrowed, setdaiAmountBorrowed] = useState("loading...");

    return (
        <div>
            {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
            <div style={{border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64}}>
                <h2>First Step : Deposit ETH to AAVE via WETH:</h2>

                <div style={{margin: 8}}>
                    <Input onChange={(e) => {
                        setethAmountToDepositToAave(e.target.value)
                    }}/>
                    <Button onClick={() => {
                        tx(mainnetWETHAaveContract.depositETH(address, "0", {
                            value: parseEther(ethAmountToDepositToAave.toString())
                        }))
                    }}>Deposit to AAVE</Button>
                </div>

                <Divider/>

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

                <div>Second Step : Deposit to Credit Pool the Amount you want to delegate</div>

                <div style={{margin: 8}}>
                    <div>Amount of aToken to deposit to Credit Pool</div>
                    <Input onChange={(e) => {
                        setNewAmountToDeposit(e.target.value)
                    }}/>
                    <div>Amount of aTokens to delegate</div>
                    <Input onChange={(e) => {
                        setNewAmountToDelegate(e.target.value)
                    }}/>
                    <Button onClick={async () => {
                        console.log(" amount to deposit", amountToDeposit);
                        /* look how you call setDeposit on your contract: */
                        let amount = 10;
                        let aTokenAddress = "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e";
                        let debtTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
                        console.log("amountToDelegate", parseEther(amountToDelegate));
                        console.log("amountToDeposit", parseEther(amountToDeposit));
                        console.log("marginPoolAddress:", marginPoolAddress);
                        await tx(aWethContract.approve(readContracts.CreditPool.address, parseEther(amountToDeposit)));
                        await tx(writeContracts.CreditPool.deposit(parseEther(amountToDeposit), aTokenAddress, marginPoolAddress, parseEther(amountToDelegate), debtTokenAddress))
                    }}>Set Deposit</Button>
                </div>

                <Divider/>
                <div><strong>Your stats : </strong></div>
                <div>Delegated Amount: {depositors && formatEther(depositors[0].toString())}</div>
                <div>Deposit Amount: {depositors && formatEther(depositors[1].toString())}</div>

                <Divider/>

                <div><strong>Total credit pool stats : </strong></div>
                <div>Total Delegation: {totalDelegation && formatEther(totalDelegation.toString())}</div>

                <div>Total Deposit: {totalDeposit && formatEther(totalDeposit.toString())}</div>

                <Divider/>

                Your Address:
                <Address
                    value={address}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                />

                <Divider/>


                <Divider/>

                {  /* use formatEther to display a BigNumber: */}
                <h2>Your Balance: {yourLocalBalance ? formatEther(yourLocalBalance) : "..."}</h2>

                OR

                <Balance
                    address={address}
                    provider={localProvider}
                    dollarMultiplier={price}
                />

                <Divider/>


                {  /* use formatEther to display a BigNumber: */}
                <h2>Your Balance: {yourLocalBalance ? formatEther(yourLocalBalance) : "..."}</h2>

                <Divider/>


                Your Contract Address:
                <Address
                    value={readContracts ? readContracts.CreditPool.address : readContracts}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                />


            </div>

            {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in CreditPool.sol! )
      */}
            <div style={{width: 600, margin: "auto", marginTop: 32, paddingBottom: 32}}>
                <h2>Events:</h2>
                <List
                    bordered
                    dataSource={setDepositEvent}
                    renderItem={(item) => {
                        return (
                            <List.Item key={item.blockNumber + "_" + item.sender + "_" + item.purpose}>

                            </List.Item>
                        )
                    }}
                />
            </div>


        </div>
    );
}
