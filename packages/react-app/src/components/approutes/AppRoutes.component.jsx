import {BrowserRouter, Route, Switch} from "react-router-dom";
import {AppMenu} from "../appmenu/AppMenu.component";
import {Contract} from "../index";
import {ExampleUI, Hints, Subgraph} from "../../views";
import React from "react";
import * as PropTypes from "prop-types";

AppRoutes.propTypes = {
    route: PropTypes.any,
    onClick: PropTypes.func,
    onClick1: PropTypes.func,
    onClick2: PropTypes.func,
    onClick3: PropTypes.func,
    userProvider: PropTypes.any,
    address: PropTypes.string,
    yourLocalBalance: PropTypes.any,
    price: PropTypes.any,
    tx: PropTypes.any,
    writeContracts: PropTypes.any,
    readContracts: PropTypes.any,
    purpose: PropTypes.any,
    purposeEvents: PropTypes.any,
    subgraphUri: PropTypes.any,
    mainnetProvider: PropTypes.any,
    localProvider: PropTypes.any,
    blockExplorer: PropTypes.any
};

export function AppRoutes(props) {
    return <BrowserRouter>

        <AppMenu route={props.route} onClick={props.onClick} onClick1={props.onClick1} onClick2={props.onClick2}
                 onClick3={props.onClick3}/>
        <Switch>
            <Route exact path="/">
                {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}
                <Contract
                    name="YourContract"
                    signer={props.userProvider.getSigner()}
                    provider={props.localProvider}
                    address={props.address}
                    blockExplorer={props.blockExplorer}
                />

                { /* Uncomment to display and interact with an external contract (DAI on mainnet):
            <Contract
              name="DAI"
              customContract={mainnetDAIContract}
              signer={userProvider.getSigner()}
              provider={mainnetProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
            */}
            </Route>
            <Route path="/hints">
                <Hints
                    address={props.address}
                    yourLocalBalance={props.yourLocalBalance}
                    mainnetProvider={props.mainnetProvider}
                    price={props.price}
                />
            </Route>
            <Route path="/exampleui">
                <ExampleUI
                    address={props.address}
                    userProvider={props.userProvider}
                    mainnetProvider={props.mainnetProvider}
                    localProvider={props.localProvider}
                    yourLocalBalance={props.yourLocalBalance}
                    price={props.price}
                    tx={props.tx}
                    writeContracts={props.writeContracts}
                    readContracts={props.readContracts}
                    purpose={props.purpose}
                    setPurposeEvents={props.purposeEvents}
                />
            </Route>
            <Route path="/subgraph">
                <Subgraph
                    subgraphUri={props.subgraphUri}
                    tx={props.tx}
                    writeContracts={props.writeContracts}
                    mainnetProvider={props.mainnetProvider}
                />
            </Route>
        </Switch>
    </BrowserRouter>;
}
