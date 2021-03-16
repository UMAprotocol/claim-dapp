import React from "react";
import { ethers } from "ethers";

import { useConnection } from "./useConnection";
import { useClaims, Claim } from "./useClaims";
import { contracts } from "../config";

const EMPTY: unique symbol = Symbol();

type TxStatus = "idle" | "pending" | "resolved" | "rejected";

type TxAction =
  | {
      type: "set error";
      error: Error | null | string;
    }
  | {
      type: "set transaction status";
      txStatus: TxStatus;
    };

type TxState = {
  error: Error | null | string;
  txStatus: TxStatus;
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
  const { address, network, signer } = useConnection();
  const {
    claims,
    isLoading: isLoadingProof,
    error: errorProof,
    refetch,
  } = useClaims();
  const [txState, dispatch] = React.useReducer(txReducer, {
    error: null,
    txStatus: "idle",
  });

  const claim = React.useCallback(
    (claimIdx = 0) => {
      // check if we can actually claim options for this claimIdx.
      if (!(claims && claims.length > claimIdx && network?.chainId && signer)) {
        if (!(claims && claims.length > claimIdx)) {
          dispatch({
            type: "set error",
            error: "There are no options to claim for this address.",
          });
          dispatch({ type: "set transaction status", txStatus: "rejected" });
        }
        return;
      }
      const merkleDistributor = new ethers.Contract(
        contracts.getMerkleDistributorAddress(network?.chainId as 1 | 42),
        contracts.merkleDistributorABI,
        signer
      );
      const { windowIndex, amount, proof: merkleProof, accountIndex } = claims[
        claimIdx
      ];
      try {
        merkleDistributor
          .claim({
            windowIndex,
            account: address,
            accountIndex,
            amount,
            merkleProof,
          })
          .then(() => {
            dispatch({ type: "set transaction status", txStatus: "resolved" });
            refetch();
          })
          .catch(() => {
            dispatch({ type: "set transaction status", txStatus: "rejected" });
          });
        dispatch({ type: "set transaction status", txStatus: "pending" });
      } catch (error) {
        console.error(error);
        dispatch({ type: "set error", error });
      }
    },
    [address, claims, network?.chainId, refetch, signer]
  );
  const value = { claims, isLoadingProof, errorProof, claim, ...txState };

  return (
    <OptionsContext.Provider {...delegated} value={value}>
      {children}
    </OptionsContext.Provider>
  );
};

export function useOptions() {
  const context = React.useContext(OptionsContext);
  if (context === EMPTY) {
    throw new Error("UseOptions must be used within an OptionsProvider.");
  }
  return context;
}
