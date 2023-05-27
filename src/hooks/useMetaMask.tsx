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

  const getAccount = async () => {
    try {
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        const balance = (await ethereum!.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        })) as string;

        setMetaMaskData({ status: "idle", wallet: accounts[0], balance });
        getDataWallet();
      }

      console.log("data : ", accounts);
    } catch (error) {
      console.log("ERROR METMASK :", error);
    }
  };

  const onConnectToWallet = async () => {
    updateSomeMetaMaskData("status", "loading");

    setTimeout(() => {
      getAccount();
    }, 2000);
  };

  const onDisconnect = () => {
    updateSomeMetaMaskData("status", "loading");

    setTimeout(() => {
      removeMetaMaskData();
      // melepas dari listener atau registry
      if (typeof ethereum !== undefined) {
        ethereum.removeAllListeners("accountsChanged");
      }
    }, 2000);
  };

  function isAccountList(accounts: unknown): accounts is string[] {
    return (
      Array.isArray(accounts) &&
      accounts.every((account) => typeof account === "string")
    );
  }

  const getDataWallet = () => {
    ethereum.on("accountsChanged", async (newAccounts: any) => {
      if (isAccountList(newAccounts) && newAccounts.length > 0) {
        // upon receiving a new wallet, we'll request the balance to synchronize the UI again.
        const newBalance = await ethereum!.request({
          method: "eth_getBalance",
          params: [newAccounts[0], "latest"],
        });

        const narrowedBalance =
          typeof newBalance === "string" ? newBalance : "";

        setMetaMaskData({
          type: "connect",
          wallet: newAccounts[0],
          balance: narrowedBalance,
        });
      } else {
        onDisconnect();
      }
    });
  };

  useEffect(() => {
    // getDataWallet();
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

      // local could be null if not present in LocalStorage
      const { wallet, balance } = metaMaskData?.wallet
        ? metaMaskData
        : // backup if local storage is empty
          { wallet: null, balance: null };

      initiateMetaMaskSDK();
      setMetaMaskData({
        ...metaMaskData,
        isMetaMaskInstalled,
        status: "idle",
        wallet,
        balance,
      });
    }
  }, []);

  const showInstallMetaMask =
    metaMaskData.status !== "pageNotLoaded" &&
    !metaMaskData.isMetaMaskInstalled;

  const showConnectButton =
    metaMaskData.status !== "pageNotLoaded" &&
    metaMaskData.isMetaMaskInstalled &&
    !metaMaskData.wallet;

  const isAccountConnected =
    metaMaskData.status !== "pageNotLoaded" &&
    typeof metaMaskData.wallet === "string";

  const isLoading = metaMaskData.status === "loading";

  const onConnectDisconnect = useCallback(() => {
    if (metaMaskData?.wallet) {
      onDisconnect();
    } else {
      onConnectToWallet();
    }
  }, [metaMaskData?.wallet]);

  //  Data Transaction
  const [dataTransaction, setDataTransaction] = useState({
    to: "",
    value: 0.0,
    // gasPrice : "0x09184e72a000",
    // gas: "0x2710",
  });

  const isDisabledButtonSendEth =
    dataTransaction.to === "" ||
    dataTransaction.value === 0.0 ||
    !isAccountConnected;

  const onSendTransaction = async () => {
    updateSomeMetaMaskData("status", "loading");

    const accounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    ethereum!
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            ...dataTransaction,
            from: accounts[0],
            value:
              dataTransaction.value === 0.0
                ? ""
                : convertNumberToHex(dataTransaction.value),
          },
        ],
      })
      .then((txHash: any) => {
        console.log(txHash);
        openToast(
          "success",
          `Transfer to ${dataTransaction.to} with ${dataTransaction.value} ETH succesfully!`
        );
        setDataTransaction({
          to: "",
          value: 0.0,
        });
        setTimeout(() => {
          getAccount();
        }, 30000);
      })
      .catch((error: any) => {
        updateSomeMetaMaskData("status", "idle");
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
    showConnectButton,
    showInstallMetaMask,
    isLoading,
    onSendTransaction,
    isDisabledButtonSendEth,
    onChangeInput,
    dataTransaction,
  };
}
