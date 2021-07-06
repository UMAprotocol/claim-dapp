import React from "react";
import { useQueryClient } from "react-query";
import { useConnection } from "./useConnection";
import { useTransactions } from "./useTransactions";

import { ethers } from "ethers";
import { getKpiOptionsEMP, getKpiTokenContract } from "../utils";

// max uint value is 2^256 - 1
const MAX_UINT_VAL = ethers.BigNumber.from(2).pow(256).sub(1);
const INFINITE_APPROVAL_AMOUNT = MAX_UINT_VAL;

export function useRedeem() {
  const { account, signer, chainId } = useConnection();
  const [error, setError] = React.useState<Error>();
  const { addTransaction } = useTransactions();

  const queryClient = useQueryClient();
  const redeemCallback = React.useCallback(async () => {
    if (!chainId || !account || !signer) {
      return;
    }

    try {
      const kpiOptionsToken = getKpiTokenContract(signer, chainId);
      const emp = getKpiOptionsEMP(signer, chainId);

      const allowance = await kpiOptionsToken.allowance(account, emp.address);
      const balance = await kpiOptionsToken.balanceOf(account);
      const hasToApprove = allowance.lt(balance);
      if (hasToApprove) {
        const approveTx = await kpiOptionsToken.approve(
          emp.address,
          INFINITE_APPROVAL_AMOUNT
        );

        addTransaction({ ...approveTx, label: "approve" });
        await approveTx.wait();
      }
      const onComplete = () => {
        // This will refetch all queries that have a key starting with "balance"
        queryClient.invalidateQueries("balance");
        queryClient.refetchQueries("balance");
      };
      emp.settleExpired().then((tx) => {
        addTransaction(
          {
            ...tx,
            label: "redeem",
          },
          onComplete
        );
      });
    } catch (e) {
      setError(e);
    }
  }, [account, addTransaction, chainId, queryClient, signer]);

  return { redeemCallback, error };
}
