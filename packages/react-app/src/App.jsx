import React, {useCallback, useEffect, useState} from "react";
import "antd/dist/antd.css";
import {Router} from 'react-router-dom';
import {Button, Container} from "reactstrap";
import {JsonRpcProvider, Web3Provider} from "@ethersproject/providers";
import "./App.css";
import {web3Modal} from "./components/web3modals/web3Modals.component"
import {Header} from "./components";
import history from "./components/browserHistory";
import "./theme/plugins/nucleo/css/nucleo.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
import "./theme/scss/argon-dashboard-react.scss";
//import Hints from "./Hints";
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    📡 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/
import {INFURA_ID} from "./constants";

import {EthereumDetails} from "./components/ethereumdetails/EthereumDetails.component";
import {EthereumAccount} from "./components/ethereumaccount/EthereumAccount.component";
import LoadEthersHooks from "./helpers/loadEthersHooks";
import {AppRoutes} from "./components/approutes/AppRoutes.component";
import Sidebar from "./components/sidebar/Sidebar.component";


// 😬 Sorry for all the console logging 🤡
const DEBUG = true

// 🔭 block explorer URL
const blockExplorer = "https://etherscan.io/" // for xdai: "https://blockscout.com/poa/xdai/"

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
//const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = "http://localhost:8545"; // for xdai: https://dai.poa.network
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

function App(props) {
    const [injectedProvider, setInjectedProvider] = useState();
    const [showEthereumTools, setShowEthereumTools] = useState(false);
    const [metaProvider, setmetaProvider] = useState();
    const [metaMaskAddressChange, setmetaMaskAddressChange] = useState();

    const {
        totalDelegation,
        address,
        totalDeposit,
        IERC20Contract,
        depositors,
        delegateeDeposits,
        withdrawnEvent,
        minSolvencyRatio,
        totalBorrowedAmount, price, gasPrice, userProvider, tx, yourLocalBalance, readContracts, writeContracts, purpose, setPurposeEvents, depositBalances, setDepositEvent
        , getDepositPerUser,mainnetWETHAaveContract
    } = LoadEthersHooks(injectedProvider, mainnetProvider, localProvider, DEBUG, metaMaskAddressChange);

    const loadWeb3Modal = useCallback(async () => {
        const provider = await web3Modal.connect();
        setmetaProvider(provider)
        setInjectedProvider(new Web3Provider(provider));
    }, [setInjectedProvider]);

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            loadWeb3Modal();
        }
    }, [loadWeb3Modal]);

    useEffect(() => {
        metaProvider && metaProvider.on("accountsChanged", (accounts) => {
            setmetaMaskAddressChange(accounts[0]);
        });
    }, [metaProvider]);

    const toggle = () => {
        setShowEthereumTools(!showEthereumTools);
    }

    return (
        <Router history={history}>
            <Sidebar/>
            <Container className="main-content">

                <Container className="pt-7" fluid>
                    {/* ✏️ Edit the header and change the title to your project name */}
                    <Header/>
                    <Button onClick={() => toggle()}>Show Eth Tools</Button>
                    <AppRoutes localProvider={localProvider} mainnetProvider={mainnetProvider}
                               blockExplorer={blockExplorer}
                               userProvider={userProvider} address={address} yourLocalBalance={yourLocalBalance}
                               price={price} tx={tx}
                               writeContracts={writeContracts} readContracts={readContracts} purpose={purpose}
                               purposeEvents={setPurposeEvents} subgraphUri={props.subgraphUri}
                               depositBalances={depositBalances} setDepositEvent={setDepositEvent}
                               totalDeposit={totalDeposit} withdrawnEvent={withdrawnEvent}
                               minSolvencyRatio={minSolvencyRatio}
                               delegateeDeposits={delegateeDeposits}
                               IERC20Contract={IERC20Contract}
                               totalDelegation={totalDelegation}
                               depositors={depositors}
                               totalBorrowedAmount={totalBorrowedAmount} getDepositPerUser={getDepositPerUser} mainnetWETHAaveContract={mainnetWETHAaveContract}/>

                    {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
                    {showEthereumTools && <>  <EthereumAccount localProvider={localProvider}
                                                               mainnetProvider={mainnetProvider}
                                                               blockExplorer={blockExplorer}
                                                               address={address} userProvider={userProvider}
                                                               price={price}
                                                               loadWeb3Modal={loadWeb3Modal}/>

                        {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
                        <EthereumDetails localProvider={localProvider} mainnetProvider={mainnetProvider}
                                         blockExplorer={blockExplorer}
                                         price={price} address={address} gasPrice={gasPrice} onClick={() => {
                            window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
                        }}/></>}
                </Container>
            </Container>
        </Router>
    );
}

export default App;
