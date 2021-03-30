import { useQuery } from "react-query";
import { useConnection } from "./useConnection";
import { ethers } from "ethers";
import {
  SUPPORTED_NETWORK_IDS,
  contracts,
  currentWindowIndex,
  URLS,
} from "../config";

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
  const { address, network } = useConnection();
  const { data, isLoading, error, refetch } = useQuery<Claim[], Error>(
    [address, network?.chainId],
    () =>
      getClaims({
        address: ethers.utils.getAddress(address || ""),
        chainId: network?.chainId as ChainId,
      }),
    {
      enabled: Boolean(network?.chainId) && Boolean(address),
    }
  );

  const filteredClaims = data?.filter(
    (claim) => claim.windowIndex === currentWindowIndex
  );

  return { claims: filteredClaims, isLoading, error, refetch };
}

type ChainId = 1 | 42;
type getProofParams = {
  address: string;
  chainId: ChainId;
};
async function getClaims({ address: claimerAddress, chainId }: getProofParams) {
  const merkleDistributorAddress = contracts.getMerkleDistributorAddress(
    chainId as ChainId
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
