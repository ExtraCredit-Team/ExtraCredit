import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {INFURA_ID} from "../../constants";

/*
  Web3 modal helps us "connect" external wallets:
*/
export const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions: {
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                infuraId: INFURA_ID,
            },
        },
    },
});

export const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    setTimeout(() => {
        window.location.reload();
    }, 1);
};
