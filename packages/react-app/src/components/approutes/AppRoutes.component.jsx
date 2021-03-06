import {Route, Switch} from "react-router-dom";
import {AppMenu} from "../appmenu/AppMenu.component";
import {Hints, Subgraph} from "../../views";
import React from "react";
import * as PropTypes from "prop-types";
import {BorrowerDashboard} from "../borrowerdashboard/BorrowerDashboard.component";
import CreditPool from "../creditpool/CreditPool.component";
import MarginPool from "../marginpool/MarginPool.component";
import CreditPoolDepositor from "../creditpool/CreditPoolDepositor.component";
import Dashboard from "../../views/dashboard";
import MarginPoolInvest from "../marginpool/MarginPoolInvest.component";

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
  delegateeDeposits: PropTypes.any,
};

export function AppRoutes(props) {
  return (
    <>
      <Switch>
        <Route exact path="/">
          <Dashboard
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
            aaveLendingPool={props.aaveLendingPool}
            minSolvencyRatio={props.minSolvencyRatio}
            totalBorrowedAmount={props.totalBorrowedAmount}
            delegateeDeposits={props.delegateeDeposits}
          />
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
            aaveLendingPool={props.aaveLendingPool}
          />
        </Route>
        <Route path="/marginpool-ui">
          <MarginPoolInvest
            address={props.address}
            userProvider={props.userProvider}
            mainnetProvider={props.mainnetProvider}
            tx={props.tx}
            writeContracts={props.writeContracts}
            readContracts={props.readContracts}
            minSolvencyRatio={props.minSolvencyRatio}
            totalBorrowedAmount={props.totalBorrowedAmount}
            IERC20Contract={props.IERC20Contract}
            delegateeDeposits={props.delegateeDeposits}
            aaveLendingPool={props.aaveLendingPool}
            totalDelegation={props.totalDelegation}
          />
        </Route>
        <Route path="/old-margin">
          <MarginPool
              address={props.address}
              userProvider={props.userProvider}
              mainnetProvider={props.mainnetProvider}
              tx={props.tx}
              writeContracts={props.writeContracts}
              readContracts={props.readContracts}
              minSolvencyRatio={props.minSolvencyRatio}
              totalBorrowedAmount={props.totalBorrowedAmount}
              IERC20Contract={props.IERC20Contract}
              delegateeDeposits={props.delegateeDeposits}
              aaveLendingPool={props.aaveLendingPool}
              totalDelegation={props.totalDelegation}
          />
        </Route>
        <Route path="/new-depositor">
          <CreditPoolDepositor
            address={props.address}
            userProvider={props.userProvider}
            mainnetProvider={props.mainnetProvider}
            localProvider={props.localProvider}
            tx={props.tx}
            setDepositEvent={props.setDepositEvent}
            writeContracts={props.writeContracts}
            readContracts={props.readContracts}
            aWethContract={props.aWethContract}
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
