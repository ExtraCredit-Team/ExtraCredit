import {Button, Col, Row} from "antd";
import {Faucet, GasGauge, Ramp} from "../index";
import React from "react";
import * as PropTypes from "prop-types";

EthereumDetails.propTypes = {
    price: PropTypes.number,
    address: PropTypes.string,
    gasPrice: PropTypes.any,
    onClick: PropTypes.func,
    localProvider: PropTypes.any,
    mainnetProvider: PropTypes.any,


};

export function EthereumDetails(props) {
    return <div style={{position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10}}>
        <Row align="middle" gutter={[4, 4]}>
            <Col span={8}>
                <Ramp price={props.price} address={props.address}/>
            </Col>

            <Col span={8} style={{textAlign: "center", opacity: 0.8}}>
                <GasGauge gasPrice={props.gasPrice}/>
            </Col>
            <Col span={8} style={{textAlign: "center", opacity: 1}}>
                <Button
                    onClick={props.onClick}
                    size="large"
                    shape="round"
                >
               <span style={{marginRight: 8}} role="img" aria-label="support">
                 💬
               </span>
                    Support
                </Button>
            </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
            <Col span={24}>
                {

                    /*  if the local provider has a signer, let's show the faucet:  */
                    props.localProvider && props.localProvider.connection && props.localProvider.connection.url && props.localProvider.connection.url.indexOf("localhost") >= 0 && !process.env.REACT_APP_PROVIDER && props.price > 1 ? (
                        <Faucet localProvider={props.localProvider} price={props.price} ensProvider={props.mainnetProvider}/>
                    ) : (
                        ""
                    )
                }
            </Col>
        </Row>
    </div>;
}
