import Layout from "./layout";
import { ToastContainer } from "react-toastify";
import Loader from "./components/LoaderPage/Loader";
import Header from "./components/Header";
import InfoSection from "./components/InfoSection";
import Button from "./components/Button";
import Input from "./components/Input";

function App() {
  return (
    <>
      <Layout>
        <div className="flex flex-col items-center lg:items-stretch lg:flex-row">
          <div className="shadow-md py-6 lg:py-10 px-4 lg:px-9 rounded-lg bg-white bg-opacity-50 border-2 border-white w-10/12 lg:w-auto">
            <Header
              title="Send ETH Token"
              subTitle="This form to send eth token to another acoount, makesure address
              <br />
              is valid before sending the eth."
            />
            <div className="flex flex-col mt-8">
              <Input
                label="Wallet Adress"
                placeholder="0xxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
              <Input
                label="ETH Token"
                type="number"
                placeholder="0.01"
                maxLength={18}
                step="0.01"
                min="0"
              />
              <Button label="Send ETH" customClass="mt-1 lg:mt-7" />
              <ToastContainer className="!mb-10" />
            </div>
          </div>
          <div className="shadow-md py-6 lg:py-10 px-4 lg:px-8 rounded-lg bg-white bg-opacity-50 border-2 border-white mt-3 lg:mt-0 lg:ml-5 w-10/12 lg:w-auto">
            <Header
              title="Your account connected"
              subTitle="This is your account information"
              customClass="mb-7"
            />
            <InfoSection
              label="Wallet Adress"
              value="0xc7d32a7920ffca343ab5bb3c5ce0fac18fdffaa6"
            />
            <InfoSection label="Balance" value="0.1 ETH" />
          </div>
        </div>
      </Layout>
      {/* <Loader /> */}
    </>
  );
}

export default App;
