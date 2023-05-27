import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TMetaMaskState, TState } from "../types/metaMaskStore.type";

const metamaskInitState = {
  wallet: null,
  isMetaMaskInstalled: false,
  status: "pageNotLoaded",
  //   status: "loading",
  balance: null,
};

const useStoreWallet = create(
  persist(
    (set) => ({
      metaMaskData: metamaskInitState,
      setMetaMaskData: (data: TMetaMaskState) =>
        set((state: TState) => {
          const { wallet, balance } = data;
          const newState = {
            ...state.metaMaskData,
            wallet,
            balance,
            status: "idle",
          };
          return {
            metaMaskData: newState,
          };
        }),

      removeMetaMaskData: () =>
        set((state: TState) => ({
          ...state,
          metaMaskData: metamaskInitState,
        })),

      updateSomeMetaMaskData: (field: string, value: string | boolean) =>
        set((state: TState) => {
          return {
            metaMaskData: {
              ...state.metaMaskData,
              [field]: value,
            },
          };
        }),
    }),
    {
      name: "metaMaskData",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useStoreWallet;
