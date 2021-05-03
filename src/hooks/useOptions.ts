import React from "react";
import { ethers } from "ethers";
import { useClaims } from "./useClaims";
import { useConnection } from "./useConnection";
import { contracts } from "../config";
import { isValidChainId } from "../utils/chainId";
import { useTransactions } from "./useTransactions";

export function useOptions() {
  const { account, chainId, signer } = useConnection();
  const { claims, refetch: refetchClaims } = useClaims();
  const { addTransaction } = useTransactions();
  const [error, setError] = React.useState<Error>();

  const claimCallback = React.useCallback(
    async (claimIdx = 0) => {
      if (!chainId || !signer || !isValidChainId(chainId)) {
        return;
      }
      // check if we can claim options for this claimIdx.
      if (!claims || !(claims.length > claimIdx)) {
        setError(new Error("There are no options to claim for this address."));
        return;
      }

      const merkleDistributor = new ethers.Contract(
        contracts.getMerkleDistributorAddress(chainId),
        contracts.merkleDistributorABI,
        signer
      );
      const { windowIndex, amount, proof: merkleProof, accountIndex } = claims[
        claimIdx
      ];

      merkleDistributor
        .claim({
          windowIndex,
          account,
          accountIndex,
          amount,
          merkleProof,
        })
        .then((tx: ethers.ContractTransaction) =>
          addTransaction(tx, () => refetchClaims())
        )
        .catch(setError);
    },
    [account, addTransaction, chainId, claims, refetchClaims, signer]
  );
  return { claimCallback, error };
}
