import { ethers } from "ethers";
import { useQuery } from "react-query";

import { useConnection } from "./useConnection";
import { ADDRESSES, infuraId } from "../config";
import { ValidChainId } from "../utils/chainId";
import { getKpiTokenContract } from "../utils";

export function useOptionsSupply() {
  const { provider, chainId } = useConnection();
  const { data, isLoading, error } = useQuery<ethers.BigNumber>(
    ["kpi options supply", provider?.connection, chainId],
    () => getOptionsSupply(provider, chainId as any)
  );

  return {
    supply: data ? ethers.utils.formatEther(data) : undefined,
    isLoading,
    error,
  };
}

async function getOptionsSupply(
  web3Provider?: ethers.providers.Web3Provider,
  _chainId?: ValidChainId
) {
  const chainId = _chainId ?? 1;
  const provider =
    web3Provider != null
      ? web3Provider
      : new ethers.providers.InfuraProvider(chainId, infuraId);
  const contract = getKpiTokenContract(provider, chainId);
  contract.connect(provider);
  const supply = await contract.totalSupply();
  return supply;
}
