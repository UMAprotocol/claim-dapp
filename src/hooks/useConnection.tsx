import React from "react";
import { ethers } from "ethers";
import Onboard from "bnc-onboard";
import { API as OnboardApi, Wallet } from "bnc-onboard/dist/src/interfaces";

import { onboardBaseConfig } from "../config";
import type { ValidChainId } from "../utils/chainId";

type Provider = ethers.providers.Web3Provider;
type Address = string;
type Signer = ethers.Signer;

type ConnectionState = {
  provider: Provider | null;
  onboard: OnboardApi | null;
  signer: Signer | null;
  chainId: ValidChainId | null;
  account: Address | null;
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
      type: "set chainId";
      chainId: ValidChainId | null;
    }
  | {
      type: "set account";
      account: Address | null;
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
    case "set chainId": {
      return {
        ...state,
        chainId: action.chainId,
      };
    }
    case "set account": {
      return {
        ...state,
        account: action.account,
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
    chainId: null,
    account: null,
    error: null,
    isConnected: false,
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
    { provider, onboard, signer, chainId, account, error, isConnected },
    dispatch,
  ] = context;
  const connect = React.useCallback(async () => {
    try {
      const onboardInstance = Onboard({
        ...onboardBaseConfig(chainId as ValidChainId),
        subscriptions: {
          address: (address: string) => {
            dispatch({ type: "set account", account: address });
          },
          network: async (networkId) => {
            onboard?.config({ networkId });
            dispatch({
              type: "set chainId",
              chainId: networkId as ValidChainId,
            });
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
                type: "set chainId",
                chainId: (await ethersProvider.getNetwork())
                  .chainId as ValidChainId,
              });
            } else {
              dispatch({ type: "set provider", provider: null });
              dispatch({ type: "set chainId", chainId: null });
            }
          },
        },
      });
      await onboardInstance.walletSelect();
      await onboardInstance.walletCheck();

      dispatch({ type: "set onboard", onboard: onboardInstance });
      dispatch({ type: "set connection status", isConnected: true });
    } catch (error) {
      dispatch({ type: "set error", error });
    }
  }, [chainId, dispatch, onboard]);

  const disconnect = React.useCallback(() => {
    if (!isConnected) {
      return;
    }
    onboard?.walletReset();
    dispatch({ type: "set account", account: null });
    dispatch({ type: "set provider", provider: null });
    dispatch({ type: "set signer", signer: null });
    dispatch({ type: "set chainId", chainId: null });
    dispatch({ type: "set connection status", isConnected: false });
    dispatch({ type: "set onboard", onboard: null });
  }, [dispatch, isConnected, onboard]);
  return {
    provider,
    onboard,
    signer,
    chainId,
    account,
    error,
    isConnected,
    connect,
    disconnect,
  };
}
