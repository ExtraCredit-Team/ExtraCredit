/* eslint-disable jsx-a11y/accessible-emoji */

import React, {useState} from "react";
import {Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch} from "antd";
import {SyncOutlined} from '@ant-design/icons';
import {Address, Balance} from "../components";
import {formatEther, parseEther} from "@ethersproject/units";
import marginPoolAddress from "../contracts/MarginPool.address"

export default function CreditPool({getDepositPerUser,
                                       withdrawnEvent,
                                       minSolvencyRatio,
                                       totalBorrowedAmount,
                                       setDepositEvent,
                                       totalDeposit, address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts
                                   }) {

    const [amountToDeposit, setNewAmountToDeposit] = useState("loading...");
    const [amountToWithdraw, setNewAmountToWithdraw] = useState("loading...");


    const [amountToDelegate, setNewAmountToDelegate] = useState("loading...");

    return (
        <div>
            {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
            <div style={{border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64}}>
                <h2>Example UI:</h2>

                <div>depositBalances: {getDepositPerUser && getDepositPerUser}</div>

                <Divider/>

                <div>totalDeposit: {totalDeposit && totalDeposit}</div>

                <Divider/>

                <div style={{margin: 8}}>
                    <Input onChange={(e) => {
                      setNewAmountToDeposit(e.target.value)
                    }}/>
                    <Input onChange={(e) => {
                        setNewAmountToDelegate(e.target.value)
                    }}/>
                    <Button onClick={() => {
                        console.log(" amount to deposit", amountToDeposit);
                        /* look how you call setDeposit on your contract: */
                        let amount = 10;
                        let aTokenAddress = "0x028171bCA77440897B824Ca71D1c56caC55b68A3";
                        let debtToken = "0x778A13D3eeb110A4f7bb6529F99c000119a08E92";
                        console.log("amountToDelegate", parseEther(amountToDelegate));
                        console.log("amountToDeposit", parseEther(amountToDeposit));
                        console.log("marginPoolAddress:", marginPoolAddress);
                        console.log(typeof marginPoolAddress);
                        tx(writeContracts.CreditPool.deposit(parseEther(amountToDeposit), aTokenAddress,marginPoolAddress, parseEther(amountToDelegate) ,debtToken))
                    }}>Set Deposit</Button>
                </div>

                <Divider/>

                <div>minSolvencyRatio: {minSolvencyRatio && minSolvencyRatio.toString()}</div>



                <Divider/>


              <Divider/>



              <Divider/>

                Your Address:
                <Address
                    value={address}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                />

                <Divider/>

                ENS Address Example:
                <Address
                    value={"0x34aA3F359A9D614239015126635CE7732c18fDF3"} /* this will show as austingriffith.eth */
                    ensProvider={mainnetProvider}
                    fontSize={16}
                />

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


                <div style={{margin: 8}}>
                    <Button onClick={() => {
                        /*
                          you can also just craft a transaction and send it to the tx() transactor
                          here we are sending value straight to the contract's address:
                        */
                        tx({
                            to: writeContracts.CreditPool.address,
                            value: parseEther("0.001")
                        });
                        /* this should throw an error about "no fallback nor receive function" until you add it */
                    }}>Send Value</Button>
                </div>


                <div style={{margin: 8}}>
                    <Button onClick={() => {
                        /* you can also just craft a transaction and send it to the tx() transactor */
                        tx({
                            to: writeContracts.CreditPool.address,
                            value: parseEther("0.001"),
                            data: writeContracts.CreditPool.interface.encodeFunctionData("setDeposit(string)", ["🤓 Whoa so 1337!"])
                        });
                        /* this should throw an error about "no fallback nor receive function" until you add it */
                    }}>Another Example</Button>
                </div>

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
                                <Address
                                    value={item[0]}
                                    ensProvider={mainnetProvider}
                                    fontSize={16}
                                /> =>
                                {item[1]}
                            </List.Item>
                        )
                    }}
                />
            </div>


            <div style={{width: 600, margin: "auto", marginTop: 32, paddingBottom: 256}}>

                <Card>

                    Check out all the <a
                    href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components"
                    target="_blank" rel="noopener noreferrer">📦 components</a>

                </Card>

                <Card style={{marginTop: 32}}>

                    <div>
                        There are tons of generic components included from <a
                        href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">🐜
                        ant.design</a> too!
                    </div>

                    <div style={{marginTop: 8}}>
                        <Button type="primary">
                            Buttons
                        </Button>
                    </div>

                    <div style={{marginTop: 8}}>
                        <SyncOutlined spin/> Icons
                    </div>

                    <div style={{marginTop: 8}}>
                        Date Pickers?
                        <div style={{marginTop: 2}}>
                            <DatePicker onChange={() => {
                            }}/>
                        </div>
                    </div>

                    <div style={{marginTop: 32}}>
                        <Slider range defaultValue={[20, 50]} onChange={() => {
                        }}/>
                    </div>

                    <div style={{marginTop: 32}}>
                        <Switch defaultChecked onChange={() => {
                        }}/>
                    </div>

                    <div style={{marginTop: 32}}>
                        <Progress percent={50} status="active"/>
                    </div>

                    <div style={{marginTop: 32}}>
                        <Spin/>
                    </div>


                </Card>


            </div>


        </div>
    );
}
