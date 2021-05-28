import React from "react";
import { useConnection } from "./useConnection";
import { useTransactions } from "./useTransactions";
import { ethers } from "ethers";
import { getKpiOptionsEMP, getKpiTokenContract } from "../utils";
import { ADDRESSES } from "../config";

export function useRedeem() {
  const { account, signer, chainId } = useConnection();
  const [error, setError] = React.useState<Error>();
  const { addTransaction } = useTransactions();
  const redeemCallback = React.useCallback(async () => {
    if (!chainId || !account || !signer) {
      return;
    }

    try {
      const kpiOptionsToken = getKpiTokenContract(signer, chainId);
      const emp = getKpiOptionsEMP(signer, chainId);

      const approveTx = await kpiOptionsToken.approve(
        emp.address,
        ethers.utils.parseEther("20000000000000000000")
      );
      addTransaction({ ...approveTx, label: "approve" });
      await approveTx.wait();
      emp
        .settleExpired()
        .then((tx) => addTransaction({ ...tx, label: "redeem" }));
    } catch (e) {
      setError(e);
    }
  }, [account, addTransaction, chainId, signer]);

  return { redeemCallback, error };
}
