import { useQuery } from "react-query";
import { useConnection } from "./useConnection";
import { ethers } from "ethers";
import { contracts, currentWindowIndex, URLS } from "../config";

import { ValidChainId } from "../utils/chainId";

export type Claim = {
  amount: string;
  accountIndex: number;
  metaData: string[];
  windowIndex: number;
  proof: string[];
  ipfsHash: string;
  rewardToken: string;
  totalRewardDistributed: string;
  hasClaimed: boolean;
};
export function useClaims() {
  const { account, chainId } = useConnection();
  const { data, isLoading, error, refetch } = useQuery<Claim[], Error>(
    [account, chainId],
    () =>
      getClaims({
        address: ethers.utils.getAddress(account || ""),
        chainId: chainId as ValidChainId,
      }),
    {
      enabled: Boolean(chainId) && Boolean(account),
    }
  );

  const filteredClaims = data?.filter(
    (claim) => claim.windowIndex === currentWindowIndex
  );

  return { claims: filteredClaims, isLoading, error, refetch };
}

export function useHasClaimed(address?: string) {
  const { claims } = useClaims();
  const claim = claims && claims[0];
  return Boolean(claim?.hasClaimed);
}

type getProofParams = {
  address: string;
  chainId: ValidChainId;
};
async function getClaims({
  address: claimerAddress,
  chainId: _chainId,
}: getProofParams) {
  const chainId = _chainId === 1337 ? 42 : _chainId;
  const merkleDistributorAddress = contracts.getMerkleDistributorAddress(
    chainId
  );
  const merkleProofUrl = URLS.merkleProofHelper;
  const headers = {
    "Content-Type": "application/json",
  };
  const response = await fetch(merkleProofUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ merkleDistributorAddress, claimerAddress, chainId }),
  });

  if (!response.ok) {
    throw new Error(`Something went wrong`);
  }

  return response.json();
}
