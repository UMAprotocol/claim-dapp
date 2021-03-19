import { ethers } from "ethers";
import merkleDistributor from "@uma/core/build/contracts/MerkleDistributor.json";
import ERC20 from "@uma/core/build/contracts/ERC20.json";
type Network = ethers.providers.Network;

export const infuraId = process.env.REACT_APP_PUBLIC_INFURA_ID || "";
export default function config(network: Network | null) {
  const infuraRpc = `https://${
    network ? network?.name : "mainnet"
  }.infura.io/v3/${infuraId}`;

  return {
    onboardConfig: {
      apiKey: process.env.REACT_APP_PUBLIC_ONBOARD_API_KEY || "",
      onboardWalletSelect: {
        wallets: [
          { walletName: "metamask", preferred: true },
          {
            walletName: "imToken",
            rpcUrl:
              !!network && network.chainId === 1
                ? "https://mainnet-eth.token.im"
                : "https://eth-testnet.tokenlon.im",
            preferred: true,
          },
          { walletName: "coinbase", preferred: true },
          {
            walletName: "portis",
            apiKey: process.env.REACT_APP_PUBLIC_PORTIS_API_KEY,
          },
          { walletName: "trust", rpcUrl: infuraRpc },
          { walletName: "dapper" },
          {
            walletName: "walletConnect",
            rpc: { [network?.chainId || 1]: infuraRpc },
          },
          { walletName: "walletLink", rpcUrl: infuraRpc },
          { walletName: "opera" },
          { walletName: "operaTouch" },
          { walletName: "torus" },
          { walletName: "status" },
          { walletName: "unilogin" },
          {
            walletName: "ledger",
            rpcUrl: infuraRpc,
          },
        ],
      },
      walletCheck: [
        { checkName: "connect" },
        { checkName: "accounts" },
        { checkName: "network" },
        { checkName: "balance", minimumBalance: "0" },
      ],
    },
  };
}

export const expiryDate = process.env.REACT_APP_EXPIRY_DATE || "June 30 2021";
export const SUPPORTED_NETWORK_IDS = [1, 42] as const;

const getMerkleDistributorAddress = (chainId: 1 | 42) =>
  chainId === 1
    ? process.env.REACT_APP_PUBLIC_MAINNET_DISTRIBUTOR_ADDRESS || ""
    : process.env.REACT_APP_PUBLIC_KOVAN_DISTRIBUTOR_ADDRESS || "";

export const contracts = {
  merkleDistributorABI: merkleDistributor.abi,
  getMerkleDistributorAddress,
};

export const KPIOptionsToken = {
  abi: ERC20.abi,
  address: (chainId: 1 | 42) =>
    chainId === 1
      ? process.env.REACT_APP_PUBLIC_MAINNET_KPI_TOKEN_ADDRESS || ""
      : process.env.REACT_APP_PUBLIC_KOVAN_KPI_TOKEN_ADDRESS || "",
};

export const currentWindowIndex = Number(
  process.env.REACT_APP_PUBLIC_WINDOW_INDEX
);

export const URLS = {
  TVLEndpoint:
    process.env.REACT_APP_PUBLIC_TVL_ENDPOINT ||
    "https://api.umaproject.org/uma-tvl",
  merkleProofHelper:
    process.env.REACT_APP_PUBLIC_MERKLE_PROOF_HELPER ||
    "https://api.umaproject.org/get-claims",
};
