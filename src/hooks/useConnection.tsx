import React from "react";
import { ethers } from "ethers";

enum ActionType {
  CONNECT,
  DISCONNECT,
  UPDATE,
  UPDATE_FROM_ERROR,
  ERROR,
}
type ConnectionManagerState = {
  provider?: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  account?: string;
  connector?: any;
  chainId?: number;
  error?: Error;
};
type Action =
  | {
      type: ActionType.CONNECT;
      payload: ConnectionManagerState;
    }
  | {
      type: ActionType.DISCONNECT;
    }
  | {
      type: ActionType.UPDATE | ActionType.UPDATE_FROM_ERROR;
      payload: ConnectionManagerState;
    }
  | {
      type: ActionType.ERROR;
      payload: Pick<ConnectionManagerState, "error">;
    };

function reducer(
  state: ConnectionManagerState,
  action: Action
): ConnectionManagerState {
  switch (action.type) {
    case ActionType.CONNECT: {
      console.log(`Connection action called..`);
      console.log({ state, action });
      return { ...state, ...action.payload };
    }
    case ActionType.DISCONNECT: {
      return {};
    }
    case ActionType.ERROR: {
      const { error } = action.payload;
      return {
        ...state,
        error,
      };
    }
    case ActionType.UPDATE: {
      const { provider, signer, account, chainId, connector } = action.payload;
      return {
        ...state,
        ...(provider ? { provider } : {}),
        ...(signer ? { signer } : {}),
        ...(account ? { account } : {}),
        ...(chainId ? { chainId } : {}),
        ...(connector ? { connector } : {}),
      };
    }
    case ActionType.UPDATE_FROM_ERROR: {
      const { provider, signer, account, chainId, connector } = action.payload;
      return {
        ...state,
        ...(provider ? { provider } : {}),
        ...(signer ? { signer } : {}),
        ...(account ? { account } : {}),
        ...(chainId ? { chainId } : {}),
        ...(connector ? { connector } : {}),
        error: undefined,
      };
    }
  }
}

function useConnectionManager() {
  const [state, dispatch] = React.useReducer(reducer, {});

  const { provider, signer, account, chainId, connector, error } = state;

  const connect = React.useCallback((payload: ConnectionManagerState) => {
    dispatch({
      type: ActionType.CONNECT,
      payload,
    });
  }, []);
  const disconnect = React.useCallback(() => {
    dispatch({ type: ActionType.DISCONNECT });
  }, []);
  const setError = React.useCallback((error: Error) => {
    dispatch({ type: ActionType.ERROR, payload: { error } });
  }, []);
  const update = React.useCallback(
    (update: ConnectionManagerState) => {
      if (error) {
        dispatch({
          type: ActionType.UPDATE_FROM_ERROR,
          payload: { ...update },
        });
        return;
      }

      dispatch({ type: ActionType.UPDATE, payload: { ...update } });
    },
    [error]
  );

  return {
    provider,
    signer,
    account,
    connector,
    chainId,
    error,

    connect,
    disconnect,
    update,
    setError,
  };
}

type ConnectionState = {
  connect: (payload: ConnectionManagerState) => void;
  disconnect: () => void;
  update: (update: ConnectionManagerState) => void;
  setError: (error: Error) => void;
  isConnected: boolean;
} & ConnectionManagerState;

export const ConnectionContext = React.createContext<
  undefined | ConnectionState
>(undefined);
ConnectionContext.displayName = "ConnectionContext";

export const ConnectionProvider: React.FC = ({ children }) => {
  const {
    provider,
    signer,
    account,
    chainId,
    connector,
    error,
    connect,
    disconnect,
    update,
    setError,
  } = useConnectionManager();

  const isConnected = provider != null && chainId != null && account != null;

  const value: ConnectionState = {
    provider,
    signer,
    account,
    chainId,
    connector,
    error,

    connect,
    disconnect,
    update,
    setError,

    isConnected,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};
export function useConnection() {
  const context = React.useContext(ConnectionContext);
  if (!context) {
    throw new Error("UseConnection must be used within a <ConnectionProvider>");
  }
  return context;
}
