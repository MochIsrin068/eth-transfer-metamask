import Layout from "./layout";
import { ToastContainer } from "react-toastify";
import Loader from "./components/LoaderPage/Loader";
import Header from "./components/Header";
import InfoSection from "./components/InfoSection";
import Button from "./components/Button";
import Input from "./components/Input";

import useMetaMask from "./hooks/useMetaMask";
import { convertHexToNumber } from "./utils/web3";
import useStoreWallet from "./hooks/useStoreWallet";

function App() {
  const {
    onConnectDisconnect,
    isAccountConnected,
    isLoading,
    isDisabledButtonSendEth,
    onSendTransaction,
    onChangeInput,
    dataTransaction,
  } = useMetaMask();
  const metaMaskData = useStoreWallet((state: any) => state?.metaMaskData);
  const { balance, wallet } = metaMaskData;

  return (
    <>
      <Layout
        onConnectDisconnect={onConnectDisconnect}
        isAccountConnected={isAccountConnected}
      >
        <div className="flex flex-col items-center lg:items-stretch lg:flex-row">
          <div className="shadow-md py-6 lg:py-10 px-4 lg:px-9 rounded-lg bg-white bg-opacity-50 border-2 border-white w-10/12 lg:w-auto">
            <Header
              title="Send ETH Token"
              subTitle="This form to send ETH token to another account, makesure address
              <br />
              is valid before sending the ETH Token."
            />
            <div className="flex flex-col mt-8">
              <Input
                label="Wallet Adress"
                placeholder="0xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                onChange={(event: any) => onChangeInput(event, "to")}
                value={dataTransaction.to}
              />
              <Input
                label="ETH Token"
                type="number"
                placeholder="0.01"
                maxLength={18}
                step="0.01"
                min="0"
                onChange={(event: any) => onChangeInput(event, "value")}
                value={dataTransaction.value}
              />
              <Button
                label="Send ETH"
                customClass={`mt-1 lg:mt-7 ${
                  isDisabledButtonSendEth
                    ? "!bg-gray-400 hover:!bg-gray-400"
                    : ""
                }`}
                disabled={isDisabledButtonSendEth}
                onClick={onSendTransaction}
              />
              {isDisabledButtonSendEth && (
                <span className="text-xs italic text-red-500 mt-2">
                  *{" "}
                  {isAccountConnected
                    ? "Button disable because the form has not been filled in completely."
                    : "Connect to your wallet before transfer, you can click Connect button."}
                </span>
              )}
              <ToastContainer className="!mb-10 !w-[460px]" />
            </div>
          </div>
          {isAccountConnected && (
            <div className="shadow-md py-6 lg:py-10 px-4 lg:px-8 rounded-lg bg-white bg-opacity-50 border-2 border-white mt-3 lg:mt-0 lg:ml-5 w-10/12 lg:w-auto">
              <Header
                title="Your Account Connected!"
                subTitle="This is your account information"
                customClass="mb-7"
              />
              <InfoSection label="Wallet Adress" value={wallet || ""} />
              <InfoSection
                label="Balance"
                value={`${convertHexToNumber(balance) || ""} ETH`}
              />
            </div>
          )}
        </div>
      </Layout>
      {isLoading && <Loader />}
    </>
  );
}

export default App;
