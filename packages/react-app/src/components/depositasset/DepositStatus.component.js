import {Button, Card, CardBody, CardTitle, Col, Row} from "reactstrap";
import React from "react";
import {formatEther} from "@ethersproject/units";
import DepositCard from "../dashboardComponents/depositCard/depositCard";

export function DepositStatus(props) {
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
                            $0
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
                            <span className="h2 font-weight-bold mb-0">${props.protocolProps.totalDelegation && formatEther(props.protocolProps.totalDelegation.toString())}</span>
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
            <Button className={"mt-4"} size="lg" color="warning">Repay</Button>
        </Col>
        <Col lg="4">
            {props.totalDelegation && formatEther(props.protocolProps.totalDeposit.toString()) ? (
                <DepositCard onShow={props.onShow} protocolProps={props.protocolProps} />
            ) : (
                <p>Go to Deposit section in order to deposit some amount, and start earning interest</p>
            )}
        </Col>
    </Row>;
}
