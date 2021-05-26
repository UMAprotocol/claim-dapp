import merkleDistributor from "@uma/core/build/contracts/MerkleDistributor.json";
import { Initialization } from "bnc-onboard/dist/src/interfaces";

import type { ChainId, ValidChainId } from "./utils/chainId";

export const infuraId = process.env.REACT_APP_PUBLIC_INFURA_ID || "";
const getNetworkName = (chainId: ChainId) => {
  switch (chainId) {
    case 1: {
      return "homestead";
    }
    case 42: {
      return "kovan";
    }
    case 3: {
      return "ropsten";
    }
    case 4: {
      return "rinkeby";
    }
  }
};
export function onboardBaseConfig(_chainId?: ValidChainId): Initialization {
  const chainId = _chainId ?? 1;
  const infuraRpc = `https://${getNetworkName(
    chainId
  )}.infura.io/v3/${infuraId}`;

  return {
    dappId: process.env.REACT_APP_PUBLIC_ONBOARD_API_KEY || "",
    hideBranding: true,
    networkId: 1, // Default to main net. If on a different network will change with the subscription.
    walletSelect: {
      wallets: [
        { walletName: "metamask", preferred: true },
        {
          walletName: "imToken",
          rpcUrl:
            chainId === 1
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
          rpc: { [chainId]: infuraRpc },
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
    // To prevent providers from requesting block numbers every 4 seconds (see https://github.com/WalletConnect/walletconnect-monorepo/issues/357)
    blockPollingInterval: 1000 * 60 * 60,
  };
}
export const optionsName = process.env.REACT_APP_PUBLIC || "uTVL-0621";
export const expiryDate =
  process.env.REACT_APP_EXPIRY_DATE || "Jun 30 2021 22:00 UTC";

const getMerkleDistributorAddress = (chainId: ValidChainId) => {
  switch (chainId) {
    case 1: {
      return process.env.REACT_APP_PUBLIC_MAINNET_DISTRIBUTOR_ADDRESS || "";
    }
    case 42: {
      return process.env.REACT_APP_PUBLIC_KOVAN_DISTRIBUTOR_ADDRESS || "";
    }
    case 1337: {
      return (
        // if we haven't set the local address, assume we're mainnet forking
        process.env.REACT_APP_PUBLIC_LOCAL_MAINNET_DISTRIBUTOR_ADDRESS ||
        process.env.REACT_APP_PUBLIC_MAINNET_DISTRIBUTOR_ADDRESS ||
        ""
      );
    }
  }
};

export const contracts = {
  merkleDistributorABI: merkleDistributor.abi,
  getMerkleDistributorAddress,
};

export const ADDRESSES: Record<number, { [k: string]: string }> = {
  1: {
    emp: process.env.REACT_APP_PUBLIC_MAINNET_KPI_EMP || "",
    kpiOptionsToken:
      process.env.REACT_APP_PUBLIC_MAINNET_KPI_TOKEN_ADDRESS || "",
  },
  42: {
    emp: "",
    kpiOptionsToken: process.env.REACT_APP_PUBLIC_KOVAN_KPI_TOKEN_ADDRESS || "",
  },
  1337: {
    emp: process.env.REACT_APP_PUBLIC_LOCAL_KPI_EMP || "",
    kpiOptionsToken: process.env.REACT_APP_PUBLIC_LOCAL_KPI_TOKEN_ADDRESS || "",
  },
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

export const expirationTvl = +(
  process.env.REACT_APP_PUBLIC_EXPIRATION_TVL ?? 200_000_000
);

const maxPayout = 2;
const minPayout = 0.1;
export const expirationPayout = Math.max(
  minPayout,
  Math.min(maxPayout, expirationTvl / 10 ** 9)
).toFixed(3);

export const hasExpired =
  Boolean(process.env.REACT_APP_PUBLIC_HAS_EXPIRED) ??
  Date.now() > new Date(expiryDate).getTime();
