import { useQuery } from "react-query";
import { URLS } from "../config";

type Price = {
  [k: string]: {
    usd: number;
  };
};
export function usePrice(symbol = "uma", key?: string) {
  return useQuery<Price>([symbol, key], () => getPrice(symbol));
}

async function getPrice(symbol: string) {
  const query = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`;

  const response = await fetch(query);

  const priceResponse = await response.json();
  return priceResponse;
}

type TVLData = {
  currentTvl: string;
};

export function useTvl() {
  return useQuery<TVLData>("tvl", () =>
    fetch(URLS.TVLEndpoint).then((res) => res.json())
  );
}
