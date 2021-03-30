import React from "react";
import { ethers } from "ethers";
import Onboard from "bnc-onboard";
import { API as OnboardApi, Wallet } from "bnc-onboard/dist/src/interfaces";
import Alert from "../components/Alert";

import config, { SUPPORTED_NETWORK_IDS } from "../config";

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
  isConnected: boolean;
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
    }
  | {
      type: "set connection status";
      isConnected: boolean;
    };

type ConnectionDispatch = React.Dispatch<Action>;
type TConnectionContext = [ConnectionState, ConnectionDispatch];

type WithDelegatedProps = {
  [k: string]: unknown;
};

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
    case "set connection status": {
      return {
        ...state,
        isConnected: action.isConnected,
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
    isConnected: false,
  });

  return (
    <ConnectionContext.Provider value={[connection, dispatch]} {...delegated}>
      {connection.error && <Alert />}
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
    { provider, onboard, signer, network, address, error, isConnected },
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
            if (
              !SUPPORTED_NETWORK_IDS.includes(networkId) &&
              networkId != null
            ) {
              dispatch({
                type: "set error",
                error: new Error("Unsopported network."),
              });
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
      dispatch({ type: "set connection status", isConnected: true });
    } catch (error) {
      dispatch({ type: "set error", error });
    }
  }, [dispatch, network, onboard]);

  const disconnect = React.useCallback(() => {
    if (!isConnected) {
      return;
    }
    onboard?.walletReset();
    dispatch({ type: "set address", address: null });
    dispatch({ type: "set provider", provider: null });
    dispatch({ type: "set signer", signer: null });
    dispatch({ type: "set network", network: null });
    dispatch({ type: "set connection status", isConnected: false });
    dispatch({ type: "set onboard", onboard: null });
  }, [dispatch, isConnected, onboard]);
  return {
    provider,
    onboard,
    signer,
    network,
    address,
    error,
    isConnected,
    connect,
    disconnect,
  };
}
