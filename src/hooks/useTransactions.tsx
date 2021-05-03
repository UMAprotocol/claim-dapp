import React from "react";
import { ethers } from "ethers";

type Transaction = ethers.providers.TransactionResponse;
type TransactionReceipt = ethers.providers.TransactionRequest;
type TransactionStatus = "idle" | "pending" | "resolved" | "rejected";

type TransactionState = {
  transaction?: Transaction;
  status?: TransactionStatus;
  error?: Error;
};

enum ActionType {
  ERROR,
  UPDATE,
}

type Action =
  | {
      type: ActionType.UPDATE;
      payload: TransactionState;
    }
  | {
      type: ActionType.ERROR;
      payload: Pick<TransactionState, "error">;
    };
function reducer(state: TransactionState, action: Action) {
  switch (action.type) {
    case ActionType.UPDATE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case ActionType.ERROR: {
      const { error } = action.payload;
      return {
        ...state,
        error,
      };
    }
  }
}

type TransactionsManagerState = {
  addTransaction: (
    tx: Transaction,
    onComplete?: (tx: TransactionReceipt) => void
  ) => void;
} & TransactionState;
function useTransactionsManager(): TransactionsManagerState {
  const [state, dispatch] = React.useReducer(reducer, {});
  const { transaction, status, error } = state;
  const addTransaction = React.useCallback(
    (tx: Transaction, onComplete?: (tx: TransactionReceipt) => void) => {
      dispatch({
        type: ActionType.UPDATE,
        payload: { transaction: tx, status: "pending" },
      });
      tx.wait().then((txReceipt) => {
        if (onComplete) {
          onComplete(txReceipt);
        }
        dispatch({ type: ActionType.UPDATE, payload: { status: "resolved" } });
      });
    },
    []
  );
  return { addTransaction, transaction, error, status };
}

export const TransactionContext = React.createContext<
  TransactionsManagerState | undefined
>(undefined);
TransactionContext.displayName = "TransactionContext";

export const TransactionsProvider: React.FC = ({ children }) => {
  const value = useTransactionsManager();
  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export function useTransactions() {
  const context = React.useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "UseTransactions must be used within a <TransactionsProvider>."
    );
  }
  return context;
}
