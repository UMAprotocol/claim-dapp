import React from "react";
import { ethers } from "ethers";

import { useConnection } from "./useConnection";
import { useClaims, Claim } from "./useClaims";
import { contracts } from "../config";

const EMPTY: unique symbol = Symbol();

type TxStatus = "idle" | "pending" | "resolved" | "rejected";
type Tx = ethers.Transaction;
type TxAction =
  | {
      type: "set error";
      error: Error | null | string;
    }
  | {
      type: "set transaction status";
      txStatus: TxStatus;
    }
  | {
      type: "set transaction";
      tx: Tx | null;
    };

type TxState = {
  error: Error | null | string;
  txStatus: TxStatus;
  tx: Tx | null;
};

function txReducer(state: TxState, action: TxAction) {
  switch (action.type) {
    case "set error": {
      return {
        ...state,
        error: action.error,
      };
    }
    case "set transaction status": {
      return {
        ...state,
        txStatus: action.txStatus,
      };
    }
    case "set transaction": {
      return {
        ...state,
        tx: action.tx,
      };
    }
    default: {
      throw new Error(`Unsopported action type ${(action as any).type}`);
    }
  }
}

type TOptionsContext = TxState & {
  claim: () => void;
  claims?: Claim[];
  isLoadingProof: boolean;
  errorProof: Error | null;
};
const OptionsContext = React.createContext<typeof EMPTY | TOptionsContext>(
  EMPTY
);
OptionsContext.displayName = "OptionsContext";

export const OptionsProvider: React.FC = ({ children, ...delegated }) => {
  const { account, chainId, signer } = useConnection();
  const {
    claims,
    isLoading: isLoadingProof,
    error: errorProof,
    refetch,
  } = useClaims();
  const [txState, dispatch] = React.useReducer(txReducer, {
    error: null,
    txStatus: "idle",
    tx: null,
  });

  // reset network state on account, or network change.
  React.useEffect(() => {
    dispatch({ type: "set transaction status", txStatus: "idle" });
    dispatch({ type: "set error", error: null });
    dispatch({ type: "set transaction", tx: null });
  }, [account, chainId, signer]);

  const claim = React.useCallback(
    async (claimIdx = 0) => {
      // check if we can actually claim options for this claimIdx.
      if (!(claims && claims.length > claimIdx && chainId && signer)) {
        if (!(claims && claims.length > claimIdx)) {
          dispatch({
            type: "set error",
            error: "There are no options to claim for this address.",
          });
        }
        return;
      }
      // reset any erros we might have had previously
      dispatch({ type: "set error", error: null });
      const merkleDistributor = new ethers.Contract(
        contracts.getMerkleDistributorAddress(chainId),
        contracts.merkleDistributorABI,
        signer
      );
      const { windowIndex, amount, proof: merkleProof, accountIndex } = claims[
        claimIdx
      ];
      try {
        const tx: ethers.ContractTransaction = await merkleDistributor.claim({
          windowIndex,
          account,
          accountIndex,
          amount,
          merkleProof,
        });
        dispatch({ type: "set transaction", tx });
        dispatch({ type: "set transaction status", txStatus: "pending" });

        tx.wait()
          .then(() => {
            dispatch({ type: "set transaction status", txStatus: "resolved" });
            refetch();
          })
          .catch(() => {
            dispatch({ type: "set transaction status", txStatus: "rejected" });
          });
      } catch (error) {
        dispatch({ type: "set error", error: error.message });
      }
    },
    [account, claims, chainId, refetch, signer]
  );
  const value = { claims, isLoadingProof, errorProof, claim, ...txState };

  return (
    <OptionsContext.Provider {...delegated} value={value}>
      {children}
    </OptionsContext.Provider>
  );
};

export function useOptionsClaim() {
  const context = React.useContext(OptionsContext);
  if (context === EMPTY) {
    throw new Error("UseOptions must be used within an OptionsProvider.");
  }
  return context;
}
