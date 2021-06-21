import { ethers } from "ethers";
import { EthersContracts } from "@uma/core";
import { ADDRESSES, infuraId } from "../config";

export function getPageCoords(element: HTMLElement | SVGElement) {
  const { top, left, right, bottom, width, height } =
    element.getBoundingClientRect();
  return {
    top: window.innerHeight - top,
    left,
    right,
    bottom,
    width,
    height,
  };
}

export function updateDefaultObject(
  defaultObj: Record<
    string,
    {
      value: any | undefined;
      [k: string]: unknown;
    }
  >,
  freshObj: Record<
    string,
    {
      value: any;
      [k: string]: unknown;
    }
  >
) {
  return Object.keys(defaultObj).reduce((newObj, key) => {
    const freshValue = freshObj[key].value;
    return freshValue
      ? { ...newObj, [key]: { ...defaultObj[key], value: freshValue } }
      : newObj;
  }, defaultObj);
}

export function parseUSLocaleNumber(n: string | undefined) {
  if (!n) {
    return NaN;
  }
  const parsed = parseFloat(n.replace(/,/g, ""));
  return parsed;
}

export function formatUSLocaleNumber(n: number, digits = 1, currency?: string) {
  const format = Intl.NumberFormat("en-US", {
    style: currency ? "currency" : "decimal",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format;
  return format(n);
}
export function formatMillions(n: number) {
  let formattedN;
  let postfix;
  // Dealing with Billions
  if (n >= 1000) {
    formattedN = n / 1000;

    postfix = n === 1000 ? "Billion" : "Billions";
  } else {
    formattedN = n;
    postfix = "Million";
  }
  return `${formatUSLocaleNumber(formattedN, 0, "USD")} ${postfix}`;
}

export function etherscanUrlFromTx(tx: ethers.Transaction) {
  if (!tx.hash) {
    return "/";
  }
  return `https://${tx.chainId === 1 ? "" : "kovan."}etherscan.io/tx/${
    tx.hash
  }`;
}

export function getKpiOptionsEMP(
  signerOrProvider?: ethers.Signer | ethers.providers.Provider,
  chainId = 1
) {
  return EthersContracts.ExpiringMultiParty__factory.connect(
    ADDRESSES[chainId].emp,
    signerOrProvider ??
      new ethers.providers.InfuraProvider("mainnet", {
        apiKey: infuraId,
      })
  );
}

export function getKpiTokenContract(
  signerOrProvider?: ethers.Signer | ethers.providers.Provider,
  chainId = 1
) {
  return EthersContracts.ERC20__factory.connect(
    ADDRESSES[chainId].kpiOptionsToken,
    signerOrProvider ??
      new ethers.providers.InfuraProvider("mainnet", {
        apiKey: infuraId,
      })
  );
}

export function getERC20Contract(
  address: string,
  signerOrProvider?: ethers.Signer | ethers.providers.Provider
) {
  return EthersContracts.ERC20__factory.connect(
    address,
    signerOrProvider ??
      new ethers.providers.InfuraProvider("mainnet", {
        apiKey: infuraId,
      })
  );
}
