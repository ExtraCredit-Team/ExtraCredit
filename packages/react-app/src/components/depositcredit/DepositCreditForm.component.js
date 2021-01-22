import {Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Row} from "reactstrap";
import React, {useState} from "react";
import * as PropTypes from "prop-types";

export function DepositCreditForm({creditType, setCreditType, creditAmount, setCreditAmount, creditDuration, setCreditDuration}) {

    return <Card className="bg-secondary shadow">
        <CardHeader className="bg-white border-0">
            <Row className="align-items-center">
                <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                </Col>
            </Row>
        </CardHeader>
        <CardBody>
            <Form>
                <h6 className="heading-small text-muted mb-4">
                    Credit deposit informations
                </h6>
                <div className="pl-lg-4">
                    <Row>
                        <Col lg="6">
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-credit-type"
                                >
                                    Credit type
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    defaultValue="lucky.jesse"
                                    id="input-credit-type"
                                    placeholder="DAI"
                                    type="text"
                                    onChange={(e) => setCreditType(e.target.value)}
                                    value={creditType}
                                />
                            </FormGroup>
                        </Col>
                        <Col lg="6">
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-credit-amount"
                                >
                                    Amount
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-credit-amount"
                                    placeholder="100"
                                    type="number"
                                    onChange={(e) => setCreditAmount(e.target.value)}
                                    value={creditAmount}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6">
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-first-name"
                                >
                                    Period
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    defaultValue="Lucky"
                                    id="input-first-name"
                                    placeholder="First name"
                                    type="text"
                                    onChange={(e) => setCreditDuration(e.target.value)}
                                    value={creditDuration}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
            </Form>
        </CardBody>
    </Card>;
}

DepositCreditForm.propTypes = {onClick: PropTypes.func};
