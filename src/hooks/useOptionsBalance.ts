import { useQuery } from "react-query";
import { ethers } from "ethers";

import { getKpiTokenContract } from "../utils";
import { useConnection } from "./useConnection";
import { infuraId } from "../config";

export function useOptionsBalance(address?: string) {
  const { provider, chainId } = useConnection();
  const { data, ...others } = useQuery(
    ["balance", address, provider?.connection, chainId],
    () => getBalance(address!, provider, chainId),
    {
      enabled: address != null,
    }
  );

  return {
    balance: data ? ethers.utils.formatEther(data) : undefined,
    ...others,
  };
}

async function getBalance(
  address: string,
  web3Provider?: ethers.providers.Web3Provider,
  chainId = 1
) {
  const provider =
    web3Provider != null
      ? web3Provider
      : new ethers.providers.InfuraProvider(chainId, infuraId);
  const contract = getKpiTokenContract(provider, chainId);
  const balance = await contract.balanceOf(address);
  return balance;
}
