import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppMenu } from "../appmenu/AppMenu.component";
import { Contract } from "../index";
import { ExampleUI, Hints, Subgraph } from "../../views";
import React from "react";
import * as PropTypes from "prop-types";
import Sidebar from "../sidebar/Sidebar.component";
import AdminNavbar from "../adminnavbar/AdminNavBar.component";
import { BorrowerDashboard } from "../borrowerdashboard/BorrowerDashboard.component";
import { DelegateCredit } from "../delegatecredit/DelegateCredit.component";
import ExampleUI2 from "../../views/CreditPool.component";
import Dashboard from "../../views/Dashboard";
import Deposit from "../../views/deposit";

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
};

export function AppRoutes(props) {
  return (
    <>
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

          {/* Uncomment to display and interact with an external contract (DAI on mainnet):
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
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/deposit">
          <Deposit />
        </Route>
        <Route path="/borrower">
          <BorrowerDashboard />
        </Route>
        <Route path="/delegate">
          <DelegateCredit />
        </Route>
        <Route path={"/old-menu"}>
          <AppMenu route={props.route} />
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
          <ExampleUI2
            address={props.address}
            userProvider={props.userProvider}
            mainnetProvider={props.mainnetProvider}
            localProvider={props.localProvider}
            yourLocalBalance={props.yourLocalBalance}
            price={props.price}
            tx={props.tx}
            writeContracts={props.writeContracts}
            readContracts={props.readContracts}
            depositBalances={props.depositBalances}
            setDepositEvent={props.setDepositEvent}
            totalDeposit={props.totalDeposit}
            withdrawnEvent={props.withdrawnEvent}
            minSolvencyRatio={props.minSolvencyRatio}
            totalBorrowedAmount={props.totalBorrowedAmount}
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
    </>
  );
}
