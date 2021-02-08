import {Button, Card, CardBody, CardTitle, Col, Input, Row} from "reactstrap";
import React, {useEffect, useState} from "react";
import {formatEther, parseEther} from "@ethersproject/units";

const aTokenAddress = "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e";

export function DepositStatus({protocolProps}) {

    const [rewardRatioRate, setrewardRatioRate] = useState("");
    const [amountToWithdraw, setAmaountToWithdraw] = useState("");

    useEffect(() => {

        async function calculteRewardAllocation() {
            if (protocolProps.totalBorrowedAmount && protocolProps.totalDelegation) {
                if ((formatEther(protocolProps.totalBorrowedAmount) !== 0) && (formatEther(protocolProps.totalDelegation) !== 0)) {
                    const rate = await protocolProps.readContracts.InterestRateStrategy.computeDepositRewardRate(parseEther(protocolProps.totalBorrowedAmount.toString()), parseEther(protocolProps.totalDelegation.toString()));
                    setrewardRatioRate((parseFloat(formatEther(rate)) * 100).toFixed(2));
                }
            }
        }

        calculteRewardAllocation();
    }, [protocolProps.readContracts])

    const withdraw = async () => {
        await protocolProps.tx(protocolProps.writeContracts.CreditPool.withdraw(amountToWithdraw, aTokenAddress))
    }

    return <Row>
        <Col lg="6">
            <Card className="card-stats mt-2 mb-4 mb-xl-0">
                <CardBody>
                    <Row>
                        <div className="col">
                            <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                            >
                                Total deposited
                            </CardTitle>
                            <span className="h2 font-weight-bold mb-0">
                            aWETH {protocolProps.totalDeposit && formatEther(protocolProps.totalDeposit.toString())}
                          </span>
                        </div>
                        <Col className="col-auto">
                            <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                <i className="fas fa-chart-bar"/>
                            </div>
                        </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fa fa-arrow-up"/> 3.48%
                        </span>{" "}
                        <span className="text-nowrap">Since last month</span>
                    </p>
                </CardBody>
            </Card>
            <Card className="card-stats mb-4 mt-2 mb-xl-0">
                <CardBody>
                    <Row>
                        <div className="col">
                            <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                            >
                                Total Delegated
                            </CardTitle>
                            <span
                                className="h2 font-weight-bold mb-0">${protocolProps.totalDelegation && formatEther(protocolProps.totalDelegation.toString())}</span>
                        </div>
                        <Col className="col-auto">
                            <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                <i className="fas fa-users"/>
                            </div>
                        </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-warning mr-2">
                          <i className="fas fa-equals"/> 0%
                        </span>{" "}
                        <span className="text-nowrap">Since yesterday</span>
                    </p>
                </CardBody>
            </Card>
            <Button className={"mt-4"} size="lg" color="warning"
                    onClick={withdraw}>Withdraw</Button>
            <Input
                className="form-control-alternative"
                name={"amountToWithdraw"}
                id="input-amountToWithdraw"
                placeholder="100 aWETH"
                type="number"
                onChange={(e) => setAmaountToWithdraw(e.target.value)}
            />
        </Col>
        <Col lg={6}>
            <Card className="card-stats mb-4 mt-2 mb-xl-0">
                <CardBody>
                    <Row>
                        <div className="col">
                            <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                            >
                                Reward allocation ratio
                            </CardTitle>
                            <span className="h2 font-weight-bold mb-0">{rewardRatioRate}%</span>
                        </div>
                        <Col className="col-auto">
                            <div className="icon icon-shape bg-blue text-white rounded-circle shadow">
                                <i className="fas fa-percent"/>
                            </div>
                        </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-warning mr-2">
                          <i className="fas fa-equals"/> 0%
                        </span>{" "}
                        <span className="text-nowrap">Since yesterday</span>
                    </p>
                </CardBody>
            </Card>
        </Col>
    </Row>;
}
