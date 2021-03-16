import { useQuery } from "react-query";
import { useConnection } from "./useConnection";
import {
  SUPPORTED_NETWORK_IDS,
  contracts,
  currentWindowIndex,
  URLS,
} from "../config";

export type Claim = {
  amount: string;
  accountIndex: number;
  metaData: {
    reason: string[];
  };
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
        address: "0x00e4846e2971bb2b29cec7c9efc8fa686ae21342",
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

type ChainId = typeof SUPPORTED_NETWORK_IDS[number];
type getProofParams = {
  address: string;
  chainId: ChainId;
};
async function getClaims({ address: claimerAddress, chainId }: getProofParams) {
  const merkleDistributorAddress = contracts.getMerkleDistributorAddress(
    chainId
  );
  const merkleProofUrl = URLS.merkleProofHelper;
  const headers = {
    "Content-Type": "application/json",
    Origin: "",
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
