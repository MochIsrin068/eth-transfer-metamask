import { openToast } from "../lib/Toast";

type TPropsButton = {
  label: string;
  customClass?: string;
};

export default function Button({ label, customClass }: TPropsButton) {
  return (
    <button
      className={`py-1 px-4 lg:py-2 lg:px-6 text-white bg-purple-500 hover:bg-purple-400 rounded-md ${customClass}`}
      onClick={() => openToast("success", "Succesfuly transfer eth")}
    >
      {label}
    </button>
  );
}
