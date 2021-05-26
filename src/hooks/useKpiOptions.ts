import React from "react";
import { ethers } from "ethers";
import { useClaims } from "./useClaims";
import { useConnection } from "./useConnection";
import { contracts } from "../config";
import { isValidChainId } from "../utils/chainId";
import { useTransactions } from "./useTransactions";

export function useKpiOptions(accountToClaim?: string) {
  const { chainId, signer } = useConnection();
  const { claims, refetch: refetchClaims } = useClaims(accountToClaim);
  const { addTransaction } = useTransactions();
  const [error, setError] = React.useState<Error>();

  const claimCallback = React.useCallback(
    async (claimIdx = 0) => {
      if (!chainId || !signer || !isValidChainId(chainId) || !accountToClaim) {
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
      const {
        windowIndex,
        amount,
        proof: merkleProof,
        accountIndex,
      } = claims[claimIdx];

      merkleDistributor
        .claim({
          windowIndex,
          account: accountToClaim,
          accountIndex,
          amount,
          merkleProof,
        })
        .then((tx: ethers.ContractTransaction) => {
          addTransaction(tx);
          return tx.wait();
        })
        .then(() => refetchClaims())
        .catch(setError);
    },
    [accountToClaim, addTransaction, chainId, claims, refetchClaims, signer]
  );
  return { claimCallback, error };
}
