import React from "react";
import { ethers } from "ethers";
import Onboard from "bnc-onboard";
import { API as OnboardApi, Wallet } from "bnc-onboard/dist/src/interfaces";

import config from "../config";

type Provider = ethers.providers.Web3Provider;
type Address = string;
type Network = ethers.providers.Network;
type Signer = ethers.Signer;

type ConnectionState = {
  provider: Provider | null;
  onboard: OnboardApi | null;
  signer: Signer | null;
  network: Network | null;
  address: Address | null;
  error: Error | null;
};

type Action =
  | {
      type: "set provider";
      provider: Provider | null;
    }
  | {
      type: "set onboard";
      onboard: OnboardApi | null;
    }
  | {
      type: "set signer";
      signer: Signer | null;
    }
  | {
      type: "set network";
      network: Network | null;
    }
  | {
      type: "set address";
      address: Address | null;
    }
  | {
      type: "set error";
      error: Error | null;
    };

type ConnectionDispatch = React.Dispatch<Action>;
type TConnectionContext = [ConnectionState, ConnectionDispatch];

type WithDelegatedProps = {
  [k: string]: unknown;
};

const SUPPORTED_NETWORK_IDS: number[] = [1, 42];
const EMPTY: unique symbol = Symbol();

const ConnectionContext = React.createContext<
  TConnectionContext | typeof EMPTY
>(EMPTY);
ConnectionContext.displayName = "ConnectionContext";

function connectionReducer(state: ConnectionState, action: Action) {
  switch (action.type) {
    case "set provider": {
      return {
        ...state,
        provider: action.provider,
      };
    }
    case "set onboard": {
      return {
        ...state,
        onboard: action.onboard,
      };
    }
    case "set signer": {
      return {
        ...state,
        signer: action.signer,
      };
    }
    case "set network": {
      return {
        ...state,
        network: action.network,
      };
    }
    case "set address": {
      return {
        ...state,
        address: action.address,
      };
    }
    case "set error": {
      return {
        ...state,
        error: action.error,
      };
    }
    default: {
      throw new Error(`Unsopported action type ${(action as any).type}`);
    }
  }
}
export const ConnectionProvider: React.FC<WithDelegatedProps> = ({
  children,
  ...delegated
}) => {
  const [connection, dispatch] = React.useReducer(connectionReducer, {
    provider: null,
    onboard: null,
    signer: null,
    network: null,
    address: null,
    error: null,
  });

  return (
    <ConnectionContext.Provider value={[connection, dispatch]} {...delegated}>
      {children}
    </ConnectionContext.Provider>
  );
};

export function useConnection() {
  const context = React.useContext(ConnectionContext);
  if (context === EMPTY) {
    throw new Error(`UseConnection must be used within a Connection Provider.`);
  }

  const [
    { provider, onboard, signer, network, address, error },
    dispatch,
  ] = context;
  const connect = React.useCallback(async () => {
    try {
      const onboardInstance = Onboard({
        dappId: config(network).onboardConfig.apiKey,
        hideBranding: true,
        networkId: 1, // Default to main net. If on a different network will change with the subscription.
        subscriptions: {
          address: (address: string | null) => {
            dispatch({ type: "set address", address });
          },
          network: async (networkId: any) => {
            if (!SUPPORTED_NETWORK_IDS.includes(networkId)) {
              throw new Error(
                "This dApp will work only with the Mainnet or Kovan network"
              );
            }
            onboard?.config({ networkId: networkId });
          },
          wallet: async (wallet: Wallet) => {
            if (wallet.provider) {
              const ethersProvider = new ethers.providers.Web3Provider(
                wallet.provider
              );
              dispatch({ type: "set provider", provider: ethersProvider });
              dispatch({
                type: "set signer",
                signer: ethersProvider.getSigner(),
              });
              dispatch({
                type: "set network",
                network: await ethersProvider.getNetwork(),
              });
            } else {
              dispatch({ type: "set provider", provider: null });
              dispatch({ type: "set network", network: null });
            }
          },
        },
        walletSelect: config(network).onboardConfig.onboardWalletSelect,
        walletCheck: config(network).onboardConfig.walletCheck,
      });
      await onboardInstance.walletSelect();
      await onboardInstance.walletCheck();
      dispatch({ type: "set onboard", onboard: onboardInstance });
    } catch (error) {
      dispatch({ type: "set error", error });
    }
  }, [dispatch, network, onboard]);

  return {
    provider,
    onboard,
    signer,
    network,
    address,
    error,
    connect,
  };
}
