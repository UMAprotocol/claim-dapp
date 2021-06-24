import { useQuery } from "react-query";
import { ethers } from "ethers";

import { getKpiTokenContract, getERC20Contract } from "../utils";
import { useConnection } from "./useConnection";
import { infuraId, ADDRESSES } from "../config";

export function useOptionsBalance(address?: string) {
  const { provider, chainId } = useConnection();
  const { data, ...others } = useQuery(
    ["balance", "options", address, provider?.connection, chainId],
    () => getOptionsBalance(address!, provider, chainId),
    {
      enabled: address != null,
    }
  );

  return {
    balance: data ? ethers.utils.formatEther(data) : undefined,
    ...others,
  };
}

export function useUMABalance(address?: string) {
  const { provider, chainId } = useConnection();
  const { data, ...others } = useQuery(
    ["balance", "UMA", address, provider?.connection, chainId],
    () => getERC20Balance(address!, ADDRESSES[chainId!].uma, provider, chainId),
    { enabled: address != null && !!chainId }
  );
  return {
    balance: data ? ethers.utils.formatEther(data) : undefined,
    ...others,
  };
}

async function getOptionsBalance(
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

async function getERC20Balance(
  address: string,
  contractAddress: string,
  web3Provider?: ethers.providers.Web3Provider,
  chainId = 1
) {
  const provider =
    web3Provider != null
      ? web3Provider
      : new ethers.providers.InfuraProvider(chainId, infuraId);
  const contract = getERC20Contract(contractAddress, provider);
  const balance = await contract.balanceOf(address);
  return balance;
}
