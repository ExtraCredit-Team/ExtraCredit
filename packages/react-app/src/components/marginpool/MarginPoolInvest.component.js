/* eslint-disable jsx-a11y/accessible-emoji */

import React, {useState} from "react";
import {Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Modal, Row, Spinner} from "reactstrap";
import {ErrorMessage, Form, Formik} from 'formik';
import {formatEther, parseEther} from "@ethersproject/units";
import {List} from "antd";
import * as PropTypes from "prop-types";
import {gql, useQuery} from "@apollo/client";

const aTokenAddress = "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e";
const debtTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";


const aaveDaiInterest = gql`{
  reserve(id: "0x6b175474e89094c44da98b954eedeac495271d0f") {
    symbol
    liquidityRate
  }
}
`;

function WeekOrWeeks(props) {
    if (props.investDuration == 1)
        return <strong>{props.investDuration} week</strong>
    return <strong>{props.investDuration} weeks</strong>
}

function DepositPerformanceModal(props) {
    return <Modal
        className="modal-dialog-centered"
        color="primary"
        isOpen={props.open}
        toggle={props.toggle}
    >
        <div className="modal-header text-center">
            <i className="ni ni-bell-55 ni-3x"/>
            <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={props.onClick}
            >
                <span aria-hidden={true}>×</span>
            </button>
        </div>
        <div className="modal-body">
            <div className="py-3 text-center">

                <p>
                    Your funds are never leaving our Pools. Borrowers will only be able to route the borrowed funds to a
                    certain Farm!
                </p>
            </div>
            <div>
                <h4 className="mt-4">Current Performance for 4 weeks delegation period :</h4>
                <p>10% ?</p>
            </div>
        </div>
        <div className="modal-footer">
            <Button className="btn-white" color="default" type="button" onClick={props.onClick}>
                Ok, Got it
            </Button>
        </div>
    </Modal>;
}


export const DisplayVerificationProperties = ({values, errors}) =>
    <div>
        <h5>amount To amountToBorrow: <strong>{values.amountToBorrow}{errors.amountToBorrow}</strong></h5>
        <h5>amount to investDuration: <strong>{values.investDuration}{errors.investDuration}</strong></h5>
        <h5>amount to
            interestMarginAmount: <strong>{values.interestMarginAmount.toString()}{errors.interestMarginAmount}</strong>
        </h5>
        <h5>amount to persoMarginAmount: <strong>{values.persoMarginAmount}{errors.persoMarginAmount}</strong></h5>
        <h5>errors To amountToBorrow: <strong>{errors.amountToBorrow}</strong></h5>
        <h5>errors to investDuration: <strong>{errors.investDuration}</strong></h5>
        <h5>errors to interestMarginAmount: <strong>{errors.interestMarginAmount}</strong></h5>
        <h5>errors to persoMarginAmount: <strong>{errors.persoMarginAmount}</strong></h5>
    </div>

;

function EventDepositedModal(props) {
    return <Modal
        className="modal-dialog-centered"
        color="primary"
        isOpen={props.open}
        toggle={props.toggle}
    >
        <div className="modal-header text-center">
            <i className="ni ni-bell-55 ni-3x"/>
            <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={props.onClick}
            >
                <span aria-hidden={true}>×</span>
            </button>
        </div>
        <div className="modal-body">
            <h3>Latest deposits :</h3>
            <List
                bordered
                dataSource={props.dataSource}
                renderItem={props.renderItem}
            />
        </div>
        <div className="modal-footer">
            <Button className="btn-white" color="default" type="button" onClick={props.onClick}>
                Ok, Got it
            </Button>
        </div>
    </Modal>;
}

EventDepositedModal.propTypes = {
    open: PropTypes.bool,
    toggle: PropTypes.func,
    props: PropTypes.any,
    dataSource: PropTypes.any,
    renderItem: PropTypes.func,
    onClick: PropTypes.func
};

function DelegationInterestRates(props) {
    let totalInterestRates = ((props.values.investDuration * props.values.amountToBorrow * props.daiBorrowInterestRate) / 52);
    props.values.interestMarginAmount = totalInterestRates;
    return <>
        {totalInterestRates ?
            <strong>{totalInterestRates.toFixed(3)}</strong> :
            <Spinner type="grow" color="success"/>}
    </>;
}

DelegationInterestRates.propTypes = {
    values: PropTypes.any,
    daiBorrowInterestRate: PropTypes.any
};
export default function MarginPoolInvest({
                                             totalDelegation,
                                             delegateeDeposits,
                                             IERC20Contract,
                                             minSolvencyRatio,
                                             totalBorrowedAmount,
                                             aaveLendingPool,
                                             address, mainnetProvider, tx, readContracts, writeContracts
                                         }) {

    const [showPerformance, setShowPerformance] = useState(false);
    const {loading, error, data} = useQuery(aaveDaiInterest);
    let daiBorrowInterestRate;

    if (data)
        daiBorrowInterestRate = data.reserve.liquidityRate;

    return (
        <Row className={"credit-pool-card"}>
            <Col lg={6}>
                <DepositPerformanceModal open={showPerformance} toggle={() => setShowPerformance(!showPerformance)}
                                         onClick={() => setShowPerformance(false)}/>
                <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <h3 className="mb-0">Borrow and Invest</h3>
                            </Col>
                            <Col className="text-right" lg="6">
                                <Button
                                    color="primary"
                                    onClick={() => setShowPerformance(!showPerformance)}
                                    size="sm"
                                >
                                    Vault Performances
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Formik
                            onSubmit={async (values) => {
                                console.log(values);
                                await tx(IERC20Contract.approve(readContracts.MarginPool.address, parseEther("10000")));
                                await tx(writeContracts.MarginPool.invest(parseEther(values.amountToBorrow.toString()), debtTokenAddress, parseEther(values.persoMarginAmount.toString()), parseEther(values.interestMarginAmount.toString()), (values.investDuration*604800).toString()))
                            }}
                            initialValues={{
                                amountToBorrow: "",
                                investDuration: "0",
                                interestMarginAmount: "",
                                persoMarginAmount: ""
                            }}
                            validate={values => {
                                const errors = {};
                                if (values.amountToBorrow <= 0) {
                                    errors.amountToBorrow = 'Borrow at least 1!';
                                } else if (((values.persoMarginAmount + values.interestMarginAmount + values.amountToBorrow) / (values.amountToBorrow)) * 100 < 1.15) {
                                    errors.persoMarginAmount = 'Your total margin needs to be at least a tenth of the borrowed amount!'
                                } else if (values.investDuration < 1)
                                    errors.investDuration = "Too short duration";
                                return errors;
                            }}
                        >
                            {({handleChange, handleBlur, values, handleSubmit, errors}) => (
                                <>
                                    <Row>
                                        <Col>
                                            <Form onSubmit={handleSubmit}>
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <label className="form-control-label"
                                                                   htmlFor="input-amountToBorrow">Funds available to
                                                                borrow in the Pool :{"  "}</label>
                                                            {!totalDelegation ?
                                                                <Spinner type="grow" color="success"/> :
                                                                <strong>{formatEther(totalDelegation.toString())}</strong>}
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <label className="form-control-label"
                                                                   htmlFor="input-amountToBorrow">Current DAI borrow rate from AAVE  : {"  "}</label>
                                                            {(error || loading) ?
                                                                <Spinner type="grow" color="success"/> :
                                                                <strong>{(daiBorrowInterestRate * 100).toFixed(2)} %</strong>}
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-amountToBorrow"
                                                            >
                                                                Amount to Borrow
                                                            </label>
                                                            <Input
                                                                className="form-control-alternative"
                                                                name={"amountToBorrow"}
                                                                id="input-amountToBorrow"
                                                                placeholder="100 DAI"
                                                                type="number"
                                                                value={values.amountToBorrow}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            <ErrorMessage name={`amountToBorrow`}>
                                                                {msg => <div style={{color: "#f5141b"}}
                                                                             className="error-message">{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </Col>

                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-persoMarginAmount"
                                                            >
                                                                Margin Amount
                                                            </label>
                                                            <Input
                                                                className="form-control-alternative"
                                                                id="input-persoMarginAmount"
                                                                placeholder="50 aWETH"
                                                                type="number"
                                                                name={"persoMarginAmount"}
                                                                value={values.persoMarginAmount}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            <ErrorMessage name={`persoMarginAmount`}>
                                                                {msg => <div style={{color: "#f5141b"}}
                                                                             className="error-message">{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-persoMarginAmount"
                                                            >
                                                                Credit Delegation interest rates amount : {"  "}
                                                            </label>
                                                            <DelegationInterestRates values={values}
                                                                                     daiBorrowInterestRate={daiBorrowInterestRate}/>
                                                            <ErrorMessage name={`persoMarginAmount`}>
                                                                {msg => <div style={{color: "#f5141b"}}
                                                                             className="error-message">{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <h3>
                                                                Total Margin amount + interest : {(parseInt(values.persoMarginAmount) + parseFloat(values.interestMarginAmount)).toFixed(3).toString()}
                                                            </h3>
                                                            <ErrorMessage name={`persoMarginAmount`}>
                                                                {msg => <div style={{color: "#f5141b"}}
                                                                             className="error-message">{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-investDuration"
                                                            >
                                                                Borrowing duration :
                                                            </label>
                                                            <Input min="1" max="4" step="1"
                                                                   onChange={handleChange} type="range"
                                                                   name="investDuration"
                                                                   onBlur={handleBlur}
                                                                   defaultValue={values.investDuration}
                                                                   id="input-investDuration"/>
                                                            <WeekOrWeeks investDuration={values.investDuration}/>
                                                            <ErrorMessage name={`investDuration`}>
                                                                {msg => <div style={{color: "#f5141b"}}
                                                                             className="error-message">{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Button type="submit" color="warning"
                                                            style={{width: "100%"}}>Invest</Button>
                                                </Row>
                                            </Form>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}
