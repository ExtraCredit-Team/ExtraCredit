import {Route, Switch} from "react-router-dom";
import {AppMenu} from "../appmenu/AppMenu.component";
import {Contract} from "../index";
import {ExampleUI, Hints, Subgraph} from "../../views";
import React from "react";
import * as PropTypes from "prop-types";
import {BorrowerDashboard} from "../borrowerdashboard/BorrowerDashboard.component";
import {DelegateCredit} from "../delegatecredit/DelegateCredit.component";
import CreditPool from "../creditpool/CreditPool.component";
import MarginPool from "../marginpool/MarginPool.component";

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
    blockExplorer: PropTypes.any,
    depositBalances: PropTypes.any,
    setDepositEvent: PropTypes.any,
    totalDeposit: PropTypes.any,
    withdrawnEvent: PropTypes.any,
    minSolvencyRatio: PropTypes.any,
    totalBorrowedAmount: PropTypes.any,
    getDepositPerUser: PropTypes.any,
    mainnetWETHAaveContract: PropTypes.any,
    delegateeDeposits: PropTypes.any
};

export function AppRoutes(props) {
    return <>

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
            <Route path="/borrower">
                <BorrowerDashboard/>
            </Route>
            <Route path="/delegate">
                <DelegateCredit/>
            </Route>
            <Route path={"/old-menu"}>
                <AppMenu route={props.route}/>
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
            <Route path="/creditpool-ui">
                <CreditPool
                    address={props.address}
                    userProvider={props.userProvider}
                    mainnetProvider={props.mainnetProvider}
                    localProvider={props.localProvider}
                    yourLocalBalance={props.yourLocalBalance}
                    price={props.price}
                    tx={props.tx}
                    writeContracts={props.writeContracts}
                    readContracts={props.readContracts}
                    setDepositEvent={props.setDepositEvent}
                    totalDeposit={props.totalDeposit}
                    withdrawnEvent={props.withdrawnEvent}
                    mainnetWETHAaveContract={props.mainnetWETHAaveContract}
                    aWethContract={props.aWethContract}
                    totalDelegation={props.totalDelegation}
                    depositors={props.depositors}
                />
            </Route>
            <Route path="/marginpool-ui">
                <MarginPool
                    address={props.address}
                    userProvider={props.userProvider}
                    mainnetProvider={props.mainnetProvider}
                    localProvider={props.localProvider}
                    yourLocalBalance={props.yourLocalBalance}
                    price={props.price}
                    tx={props.tx}
                    writeContracts={props.writeContracts}
                    readContracts={props.readContracts}
                    minSolvencyRatio={props.minSolvencyRatio}
                    totalBorrowedAmount={props.totalBorrowedAmount}
                    IERC20Contract={props.IERC20Contract}
                    delegateeDeposits={props.delegateeDeposits}
                    aaveLendingPool={props.aaveLendingPool}
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
    </>;
}
