import { useCallback, useEffect, useState } from "react";
import { initiateMetaMaskSDK } from "../lib/MetaMaskSdk";
import useStoreWallet from "./useStoreWallet";
import { openToast } from "../lib/Toast";
import { convertNumberToHex } from "../utils/web3";

export default function useMetaMask() {
  const wds: any = window;
  const ethereum = wds.ethereum;

  const {
    metaMaskData,
    setMetaMaskData,
    updateSomeMetaMaskData,
    removeMetaMaskData,
  } = useStoreWallet((state: any) => state);

  // to get or validate account is more then one or not
  const isAccountList = (accounts: unknown): accounts is string[] => {
    return (
      Array.isArray(accounts) &&
      accounts.every((account) => typeof account === "string")
    );
  };

  const getEthBalance = async (account: Array<string>) => {
    const newBalance = await ethereum?.request({
      method: "eth_getBalance",
      params: [account[0], "latest"],
    });

    const narrowedBalance = typeof newBalance === "string" ? newBalance : "";

    setMetaMaskData({
      ...metaMaskData,
      status: "connected",
      wallet: account[0],
      balance: narrowedBalance,
    });
  };

  // to get Data wallet account connected // and to handle if have new wallet connected
  const getDataWallet = () => {
    ethereum.on("accountsChanged", async (newAccounts: any) => {
      if (isAccountList(newAccounts) && newAccounts.length > 0) {
        // upon receiving a new wallet, we'll request the balance to synchronize the UI again.
        getEthBalance(newAccounts);
      } else {
        onDisconnect();
      }
    });
  };

  // to get account and balance when use connected to wallet
  const getAccount = async () => {
    try {
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        getEthBalance(accounts);
        getDataWallet();
      }
    } catch (error: any) {
      console.log("ERROR METMASK :", error);
      openToast("error", error?.message);
    }
  };

  // connect to wallet
  const onConnectToWallet = async () => {
    updateSomeMetaMaskData("status", "loading");

    setTimeout(() => {
      getAccount();
    }, 2000);
  };

  // disonnect wallet
  const onDisconnect = () => {
    updateSomeMetaMaskData("status", "loading");

    setTimeout(() => {
      removeMetaMaskData();
      // to remove accountsChanged listener to make this apps cannot get wallet information
      if (typeof ethereum !== undefined) {
        ethereum.removeAllListeners("accountsChanged");
      }
    }, 2000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // start by checking if window.ethereum is present, indicating a wallet extension
      const ethereumProviderInjected = typeof ethereum !== "undefined";

      // this could be other wallets so we can verify if we are dealing with metamask
      // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
      const isMetaMaskInstalled =
        ethereumProviderInjected && Boolean(ethereum.isMetaMask);

      // user was previously connected, start listening to MM
      if (metaMaskData?.wallet) {
        getDataWallet();
      }

      const { wallet, balance } = metaMaskData;

      // initiate SDK
      initiateMetaMaskSDK();
      setMetaMaskData({
        ...metaMaskData,
        isMetaMaskInstalled,
        status: metaMaskData?.wallet ? "connected" : "diconnected",
        wallet,
        balance,
      });
    }
  }, []);

  const isAccountConnected = metaMaskData?.wallet;
  const isLoading = metaMaskData.status === "loading";

  const onConnectDisconnect = useCallback(() => {
    if (metaMaskData?.wallet) {
      onDisconnect();
    } else {
      onConnectToWallet();
    }
  }, [metaMaskData?.wallet]);

  const [dataTransaction, setDataTransaction] = useState<any>({
    to: "",
    value: 0.0,
  });

  const isDisabledButtonSendEth =
    !isAccountConnected ||
    dataTransaction.to === "" ||
    dataTransaction.value === 0.0 ||
    dataTransaction.value === 0 ||
    dataTransaction.value === "0" ||
    dataTransaction.value === "";

  const onSendTransaction = async () => {
    updateSomeMetaMaskData("status", "loading");

    const accounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    ethereum
      ?.request({
        method: "eth_sendTransaction",
        params: [
          {
            ...dataTransaction,
            from: accounts[0],
            value:
              dataTransaction.value === 0.0 ||
              dataTransaction.value === 0 ||
              dataTransaction.value === "0" ||
              dataTransaction.value === ""
                ? ""
                : convertNumberToHex(dataTransaction.value),
          },
        ],
      })
      .then(() => {
        setDataTransaction({
          to: "",
          value: 0.0,
        });
        setTimeout(() => {
          openToast(
            "success",
            `Transfer to ${dataTransaction.to} with ${dataTransaction.value} ETH succesfully!`
          );
          getAccount();
        }, 25000);
      })
      .catch((error: any) => {
        updateSomeMetaMaskData("status", "connected");
        setDataTransaction({
          to: "",
          value: 0.0,
        });
        openToast("error", error?.message);
      });
  };

  const onChangeInput = (event: any, state: string) => {
    event.preventDefault();
    const value = event.target.value;
    setDataTransaction((prevState: any) => ({ ...prevState, [state]: value }));
  };

  return {
    metaMaskData,
    onConnectDisconnect,
    isAccountConnected,
    isLoading,
    onSendTransaction,
    isDisabledButtonSendEth,
    onChangeInput,
    dataTransaction,
  };
}
