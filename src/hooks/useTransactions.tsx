import React from "react";
import { ethers } from "ethers";
import { useQueries, useQueryClient, UseQueryResult } from "react-query";

type Transaction = ethers.providers.TransactionResponse;
type TransactionReceipt = ethers.providers.TransactionReceipt;

type TransactionState = {
  transactions: Transaction[];
  transactionQueries?: UseQueryResult<TransactionReceipt>[];
  error?: Error;
};

type TransactionsManagerState = {
  addTransaction: (
    tx: Transaction,
    onComplete?: (tx: TransactionReceipt) => void
  ) => void;
} & TransactionState;
function useTransactionsManager() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [error, setError] = React.useState<Error>();

  const transactionQueries = useQueries(
    transactions.map((tx) => ({
      queryFn: () => tx.wait(),
      queryKey: queryKeyFromHash(tx.hash),
      // don't query confirmed transactions
      enabled: tx.confirmations === 0,
    }))
  ) as UseQueryResult<TransactionReceipt, Error>[];

  const addTransaction = React.useCallback(
    (tx: Transaction) => {
      if (transactions.find((t) => t.hash === tx.hash)) {
        setError(
          new Error(
            `Trying to add transaction with hash ${tx.hash} but it already exists.`
          )
        );
        return;
      }
      setTransactions((prevTxs) => [tx, ...prevTxs]);
    },
    [transactions]
  );
  return { transactions, transactionQueries, addTransaction, error };
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

export function useLatestTransaction() {
  const {
    transactions: [latest = {} as Transaction],
  } = useTransactions();

  const state = useTransactionState(latest.hash);

  return { state, transaction: latest };
}

export function useTransactionState(hash?: string) {
  const client = useQueryClient();
  return client.getQueryState(queryKeyFromHash(hash));
}

function queryKeyFromHash(hash?: string) {
  return ["transactions", hash];
}
