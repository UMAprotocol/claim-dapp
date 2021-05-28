import { useQuery } from "react-query";
import { URLS } from "../config";

type TVLData = {
  currentTvl: string;
};
const maxPayout = 2;
const minPayout = 0.1;
export function useTvl() {
  const { data, isLoading, error } = useQuery<TVLData>("tvl", () =>
    fetch(URLS.TVLEndpoint).then((res) => res.json())
  );
  const tvl = Number(data?.currentTvl) || 0;
  const currentPayout = Math.max(
    minPayout,
    Math.min(maxPayout, tvl / 10 ** 9)
  ).toFixed(3);

  return {
    data,
    isLoading,
    error,
    currentPayout,
    minPayout,
    maxPayout,
  };
}
