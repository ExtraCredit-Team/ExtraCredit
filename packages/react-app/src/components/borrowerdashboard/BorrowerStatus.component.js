import {Button, Card, CardBody, CardTitle, Col, Row} from "reactstrap";
import React, {useEffect, useState} from "react";
import {LottieController} from "../lottiecontroller/LottieController";
import {formatEther, parseEther} from "@ethersproject/units";

export function BorrowerStatus({props}) {

    const [solvencyRatio, setSolvencyRatio] = useState("");
    const [rewardRatioRate, setrewardRatioRate] = useState("");


    useEffect(() => {
        async function calculteRewardAllocation() {
            if (props.totalBorrowedAmount && props.totalDelegation) {
                if ((formatEther(props.totalBorrowedAmount) !== 0) && (formatEther(props.totalDelegation) !== 0)) {
                    const rate = await props.readContracts.InterestRateStrategy.computeBorrowingRewardRate(parseEther(props.totalBorrowedAmount.toString()), parseEther(props.totalDelegation.toString()));
                    const solvencyRatio = await props.readContracts.MarginPool.getUserSolvencyRatio();
                    setrewardRatioRate((parseFloat(formatEther(rate)) * 100).toFixed(2));
                    setSolvencyRatio((parseFloat(formatEther(solvencyRatio)) * 100).toFixed(2));
                }
            }
        }

        calculteRewardAllocation();
    }, [props.readContracts]);


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
                                Total DAI Borrowed by all Borrowers
                            </CardTitle>
                            <span className="h2 font-weight-bold mb-0">
                            ${props.totalBorrowedAmount && parseFloat(formatEther(props.totalBorrowedAmount.toString()))}
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
                                Total Account Holdings
                            </CardTitle>
                            <span
                                className="h2 font-weight-bold mb-0">${props.delegateeDeposits && formatEther(props.delegateeDeposits[2].toString())}</span>
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
            <Button className={"mt-4"} size="lg" color="warning">Repay</Button>
        </Col>
        <Col lg="4">
            <Card className="card-stats mt-2 mb-4 mb-xl-0">
                <CardBody>
                    <Row>
                        <div className="col text-center">
                            <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                            >
                                Solvency Ratio
                            </CardTitle>
                            <LottieController selectedAnimation={0}/>
                            <br/>
                            <span className="h1 font-weight-bold mb-0">
                                {solvencyRatio && solvencyRatio}%
                          </span>
                            <h5>
                                Minimum solvency ratio
                                is: {props.minSolvencyRatio && (parseFloat(formatEther(props.minSolvencyRatio.toString())) * 100).toFixed(1)}
                            </h5>
                        </div>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-danger mr-2">
                          <i className="fas fa-arrow-down"/> 3.48%
                        </span>{" "}
                        <span className="text-nowrap">Since last week</span>
                    </p>
                </CardBody>
            </Card>
        </Col>
    </Row>;
}
