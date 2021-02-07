import React, {useState} from "react";
import {PageHeader} from "antd";
import {Button, Container} from "reactstrap";
import {EthereumAccount} from "../ethereumaccount/EthereumAccount.component";
import {EthereumDetails} from "../ethereumdetails/EthereumDetails.component";

export default function Header(props) {

    const [showEthereumTools, setShowEthereumTools] = useState(false);

    const toggle = () => {
        setShowEthereumTools(!showEthereumTools);
    }

    return (
        <div>
            <PageHeader
                title="Extra Credit"
                subTitle="Make use of Credit delegation"
                style={{cursor: "pointer"}}
            />
            <Button onClick={() => toggle()}>Show Eth Tools</Button>
            {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
            {showEthereumTools && <>  <EthereumAccount localProvider={props.localProvider}
                                                       mainnetProvider={props.mainnetProvider}
                                                       blockExplorer={props.blockExplorer}
                                                       address={props.address} userProvider={props.userProvider}
                                                       price={props.price}
                                                       loadWeb3Modal={props.loadWeb3Modal}/>

                {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
                <EthereumDetails localProvider={props.localProvider} mainnetProvider={props.mainnetProvider}
                                 blockExplorer={props.blockExplorer}
                                 price={props.price} address={props.address} gasPrice={props.gasPrice}/></>}
        </div>


    );
}
