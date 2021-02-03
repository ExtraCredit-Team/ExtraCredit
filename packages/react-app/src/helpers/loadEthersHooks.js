import {
    useBalance,
    useContractLoader,
    useContractReader,
    useEventListener,
    useExchangePrice,
    useGasPrice,
    useUserProvider
} from "../hooks";
import {useUserAddress} from "eth-hooks";
import {Transactor} from "./index";
import useExternalContractLoader from "../hooks/ExternalContractLoader";
import AaveWETH from "./IWETHGateway";
import ILendingPool from "./ILendingPool";
import IERC20 from "./IERC20"

export default function LoadEthersHooks(injectedProvider, mainnetProvider, localProvider, DEBUG, metaMaskAddressChange) {

    /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
    const price = useExchangePrice(mainnetProvider); //1 for xdai

    /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
    const gasPrice = useGasPrice("fast"); //1000000000 for xdai

    // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

    // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
    const userProvider = useUserProvider(injectedProvider, localProvider);
    //console.log("userProvider", userProvider);

    let address = useUserAddress(userProvider);
    if(metaMaskAddressChange)
        address = metaMaskAddressChange;

    //console.log(address);

    // The transactor wraps transactions and provides notificiations
    const tx = Transactor(userProvider, gasPrice);

    // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
    const yourLocalBalance = useBalance(localProvider, address);
    //if (DEBUG) console.log("💵 yourLocalBalance", yourLocalBalance ? formatEther(yourLocalBalance) : "...")

    // just plug in different 🛰 providers to get your balance on different chains:
    const yourMainnetBalance = useBalance(mainnetProvider, address);
    //if (DEBUG) console.log("💵 yourMainnetBalance", yourMainnetBalance ? formatEther(yourMainnetBalance) : "...")

    // Load in your local 📝 contract and read a value from it:
    const readContracts = useContractLoader(localProvider);
    //if (DEBUG) console.log("📝 readContracts", readContracts)

    // If you want to make 🔐 write transactions to your contracts, use the userProvider:
    const writeContracts = useContractLoader(userProvider);
    //if (DEBUG) console.log("🔐 writeContracts", writeContracts)

    // EXTERNAL CONTRACT EXAMPLE:
    //
    // If you want to bring in the mainnet DAI contract it would look like:
    //const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)
    //console.log("🥇DAI contract on mainnet:",mainnetDAIContract)
    //
    // Then read your DAI balance like:
    //const myMainnetBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])
    //


    //AAVE WETH
    const mainnetWETHAaveContract = useExternalContractLoader(userProvider, "0xDcD33426BA191383f1c9B431A342498fdac73488", AaveWETH.abi);
    //console.log("🥇mainnetWETHAaveContract:",mainnetWETHAaveContract);


    const aaveLendingPool = useExternalContractLoader(userProvider, "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", ILendingPool.abi);
    //console.log("aaveLendingPool :", aaveLendingPool);


    const IERC20Contract = useExternalContractLoader(userProvider, "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e", IERC20.abi);
    //console.log("IERC20Contract:", IERC20Contract)


    //SCAFFOLD EXAMPLE
    // keep track of a variable from the contract in the local React state:
    const purpose = useContractReader(readContracts, "YourContract", "purpose")
    //console.log("🤗 purpose:", purpose)

    //📟 Listen for broadcast events
    const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);
    //console.log("📟 SetPurpose events:", setPurposeEvents)

    //CREDIT POOL

    const depositors = useContractReader(readContracts, "CreditPool","depositors", [address]);
    //console.log("depositors mapping", depositors);

    // 📟 Listen for broadcast events
    const setDepositEvent = useEventListener(readContracts, "CreditPool", "Deposited", localProvider, 1);
    //console.log("📟 setDeposit events:", setDepositEvent);

    // 📟 Listen for broadcast events
    const withdrawnEvent = useEventListener(readContracts, "CreditPool", "Withdrawn", localProvider, 1);
    //console.log("📟 withdrawnEvent events:", withdrawnEvent);


    // track depositBalances address
    const totalDeposit = useContractReader(readContracts, "CreditPool", "totalDeposit");
    //console.log("🤗 totalDeposit:", totalDeposit);

    // track minSolvencyRatio address
    const totalDelegation = useContractReader(readContracts, "CreditPool", "totalDelegation");
    //console.log("🤗 totalDelegation :", totalDelegation);





    //MARGIN POOL
    // track minSolvencyRatio address
     const minSolvencyRatio = useContractReader(readContracts, "MarginPool", "minSolvencyRatio");
     //console.log("🤗 minSolvencyRatio Balances:", minSolvencyRatio);

     // track minSolvencyRatio address
     const totalBorrowedAmount = useContractReader(readContracts, "MarginPool", "totalBorrowedAmount");
     //console.log("🤗 totalBorrowedAmount Balances:", totalBorrowedAmount);

    const delegateeDeposits = useContractReader(readContracts, "MarginPool", "delegateeDeposits", [address]);
    //console.log("delegateeDeposits: ", delegateeDeposits);

    /*
      const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
      console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
      */

    return {
        price,
        gasPrice,
        userProvider,
        address,
        tx,
        yourLocalBalance,
        readContracts,
        writeContracts,
        setDepositEvent,
        purpose,
        setPurposeEvents,
        withdrawnEvent,
        minSolvencyRatio,
        totalBorrowedAmount,
        mainnetWETHAaveContract,
        delegateeDeposits,
        IERC20Contract,
        totalDeposit,
        totalDelegation,
        depositors,
        aaveLendingPool
    };
}
