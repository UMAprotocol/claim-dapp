import { ethers } from "ethers";
export function getPageCoords(element: HTMLElement | SVGElement) {
  const { top, left } = element.getBoundingClientRect();
  return {
    top: window.innerHeight - top,
    left: left,
  };
}
export function getOptionsDollarValue(rawAmount: any, price: any, tvl: any) {
  const quantity = Number(ethers.utils.formatEther(rawAmount));
  const umaPerOption = Math.min(Math.max(tvl / 10 ** 9, 0.1), 2);
  const formatToUSD = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
  }).format;
  const currentPayout = formatToUSD(umaPerOption * quantity * price);
  const minPayout = formatToUSD(quantity * price * 0.1);
  const maxPayout = formatToUSD(quantity * price * 2);
  return {
    quantity,
    minPayout,
    currentPayout,
    maxPayout,
  };
}
