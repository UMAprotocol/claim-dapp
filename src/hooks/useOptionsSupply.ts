import { ethers } from "ethers";
import { useQuery } from "react-query";

import { useConnection } from "./useConnection";
import { KPIOptionsToken } from "../config";

export function useOptionsSupply() {
  const { provider, network } = useConnection();
  const fallbackProvider = ethers.providers.getDefaultProvider(
    network ?? undefined
  );
  const { data, isLoading, error } = useQuery<ethers.BigNumber>(
    ["kpi options supply", provider, network?.chainId],
    () =>
      getOptionsSupply(
        provider ?? fallbackProvider,
        (network?.chainId as 1 | 42) ?? 42
      )
  );

  const format = Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 1,
  }).format;

  return {
    supply: data ? format(+ethers.utils.formatEther(data)) : undefined,
    isLoading,
    error,
  };
}

async function getOptionsSupply(
  provider: ethers.providers.BaseProvider,
  chainId: 1 | 42
) {
  const contract = new ethers.Contract(
    KPIOptionsToken.address(chainId),
    KPIOptionsToken.abi,
    provider
  );
  const supply = await contract.totalSupply();
  return supply;
}
