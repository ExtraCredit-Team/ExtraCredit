import {Button, Col, Modal, Row} from "reactstrap";
import React, {useState} from "react";
import {DepositCreditForm} from "./DepositCreditForm.component";


export function DepositCredit({customContract, account, gasPrice, signer, provider, name, show, price, blockExplorer}) {

    const [showModal, setShowModal] = useState(false)

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const [creditType, setCreditType] = useState("");
    const [creditAmount, setCreditAmount] = useState("");
    const [creditDuration, setCreditDuration] = useState("");

    return <Row>
        <Col xl="6">
            <Button size="xl" color={"warning"} onClick={() => toggleModal()}>Deposit Credit</Button>
        </Col>

        <Modal
            className="modal-dialog-centered"
            isOpen={showModal}
            toggle={() => toggleModal()}
        >
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                    Deposit Credits
                </h5>
                <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => toggleModal()}
                >
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body">
                <DepositCreditForm creditType={creditType} creditAmount={creditAmount} creditDuration={creditDuration}
                                   setCreditAmount={setCreditAmount} setCreditDuration={setCreditDuration}
                                   setCreditType={setCreditType} onClick={e => e.preventDefault()}/>
            </div>
            <div className="modal-footer">
                <Button
                    color="secondary"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => toggleModal()}
                >
                    Close
                </Button>
                <Button color="primary" type="button">
                    Deposit
                </Button>
            </div>
        </Modal>

    </Row>
}
