/* eslint-disable jsx-a11y/accessible-emoji */

import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Modal, Row, Spinner} from "reactstrap";
import {ErrorMessage, Form, Formik} from 'formik';
import {formatEther, parseEther} from "@ethersproject/units";
import marginPoolAddress from "../../contracts/MarginPool.address";
import {List} from "antd";
import * as PropTypes from "prop-types";

const aTokenAddress = "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e";
const debtTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

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


export const DisplayVerificationProperties = ({values}) =>
    <div>
        <h5>amount To Delegate: <strong>{values.amountToDelegate}</strong></h5>
        <h5>amount to deposit: <strong>{values.amountToDeposit}</strong></h5>
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
export default function CreditPoolDepositor({
                                                mainnetWETHAaveContract,
                                                aWethContract,
                                                setDepositEvent,
                                                tx, readContracts, writeContracts
                                            }) {

    const [showPerformance, setShowPerformance] = useState(false);
    const [showEventDeposited, setShowEventDeposited] = useState(false);
    const [ethRate, setEthRate] = useState("Loading....");


    useEffect(() => {

        async function getEthRateFromContract(){
            if(readContracts)
            {
                const rate = await readContracts.CreditPool.getETHRate();
                setEthRate(parseFloat(formatEther(rate)*10000000000).toFixed(2));
            }
        }
        getEthRateFromContract();
    }, [readContracts])

    useEffect(() => {
        if (setDepositEvent)
            setShowEventDeposited(true);
    }, [setDepositEvent]);

    return (
        <Row className={"credit-pool-card"}>
            <Col lg={6}>
                <EventDepositedModal open={showEventDeposited} toggle={() => setShowEventDeposited(!showEventDeposited)}
                                     dataSource={setDepositEvent} renderItem={(item) => {
                    return (
                        <List.Item key={item.amount}>
                            {formatEther(item[0].toString())}
                        </List.Item>
                    )
                }} onClick={() => setShowEventDeposited(false)}/>
                <DepositPerformanceModal open={showPerformance} toggle={() => setShowPerformance(!showPerformance)}
                                         onClick={() => setShowPerformance(false)}/>
                <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <h3 className="mb-0">Deposit funds to Extra Credit</h3>
                            </Col>
                            <Col className="text-right" lg="6">
                                <Button
                                    color="primary"
                                    onClick={() => setShowPerformance(!showPerformance)}
                                    size="sm"
                                >
                                    Performances
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Formik
                            onSubmit={async (values) => {
                                console.log(values);
                                await tx(aWethContract.approve(readContracts.CreditPool.address, parseEther(values.amountToDeposit.toString())));
                                await tx(writeContracts.CreditPool.deposit(parseEther(values.amountToDeposit.toString()), aTokenAddress, marginPoolAddress, parseEther(values.amountToDelegate.toString()), debtTokenAddress))
                            }}
                            initialValues={{amountToDeposit: "", amountToDelegate: ""}}
                            validate={values => {
                                const errors = {};
                                if (values.amountToDeposit <= 0) {
                                    errors.amountToDeposit = 'Deposit at least 1!';
                                } else if (values.amountToDelegate > values.amountToDeposit * ethRate) {
                                    errors.amountToDelegate = 'You cant delegate more than what you deposited'
                                } else if (values.amountToDelegate <= 0) {
                                    errors.amountToDelegate = 'Please delegate some of your funds!'
                                }
                                return errors;
                            }}
                        >
                            {({handleChange, handleBlur, values, handleSubmit}) => (
                                <>
                                    <Row>
                                        <Col>
                                            <Form onSubmit={handleSubmit}>
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-depositAmount"
                                                            >
                                                                Amount to Deposit
                                                            </label>
                                                            <Input
                                                                className="form-control-alternative"
                                                                name={"amountToDeposit"}
                                                                id="input-depositAmount"
                                                                placeholder="100 aWETH"
                                                                type="text"
                                                                value={values.amountToDeposit}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            <ErrorMessage name={`amountToDeposit`}>
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
                                                                className="form-control-label mr-2"
                                                                htmlFor="input-delegatedAmount"
                                                            >
                                                                Amount of DAI to Delegate
                                                            </label>
                                                            <label
                                                            >
                                                            <em>
                                                                {readContracts ? " (current rate: 1 ETH = " + ethRate +" DAI)" :
                                                                    <Spinner type="grow" color="success"/>}
                                                            </em>
                                                            </label>
                                                            <Input
                                                                className="form-control-alternative"
                                                                id="input-delegatedAmount"
                                                                placeholder="600 DAI"
                                                                type="number"
                                                                name={"amountToDelegate"}
                                                                value={values.amountToDelegate}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            <ErrorMessage name={`amountToDelegate`}>
                                                                {msg => <div style={{color: "#f5141b"}}
                                                                             className="error-message">{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Button type="submit" color="warning"
                                                            style={{width: "100%"}}>Deposit</Button>
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
