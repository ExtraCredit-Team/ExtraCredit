import {Account} from "../index";
import {logoutOfWeb3Modal, web3Modal} from "../web3modals/web3Modals.component";
import React from "react";
import * as PropTypes from "prop-types";

EthereumAccount.propTypes = {
    address: PropTypes.string,
    userProvider: PropTypes.any,
    price: PropTypes.number,
    loadWeb3Modal: PropTypes.func
};

export function EthereumAccount(props) {
    return <div style={{position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10}}>
        <Account
            address={props.address}
            localProvider={props.localProvider}
            userProvider={props.userProvider}
            mainnetProvider={props.mainnetProvider}
            price={props.price}
            web3Modal={web3Modal}
            loadWeb3Modal={props.loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            blockExplorer={props.blockExplorer}
        />
    </div>;
}
