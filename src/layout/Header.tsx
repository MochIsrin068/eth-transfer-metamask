import TopWave from "../assets/top-wave.svg";
import EthLogo from "../assets/eth-logo.png";
import MetamaskLogo from "../assets/metamask-logo.png";
import Button from "../components/Button";

export default function Header() {
  return (
    <section>
      <menu className="flex items-center justify-between bg-white w-full py-4 px-14 z-10 relative">
        <div className="flex items-center">
          <img src={EthLogo} alt="ETH" className="w-9 mr-2" />
          <h3 className="font-extrabold text-xl">ETH Transfer</h3>
        </div>
        {/* <Button label="Connect E-wallet" /> */}
        <img
          src={MetamaskLogo}
          alt="metamask-logo"
          className="w-10 mr-2 bg-gray-200 p-2 rounded-full"
        />
      </menu>
      <img
        src={TopWave}
        alt="wave-top"
        className="absolute -top-1 z-0 opacity-5"
      />
    </section>
  );
}
