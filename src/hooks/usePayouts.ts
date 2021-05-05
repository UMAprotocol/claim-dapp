import { ethers } from "ethers";
import { useClaims } from "./useClaims";
import { useTvl } from "./useTvl";

export function usePayouts() {
  const { claims } = useClaims();
  const {
    data: tvlData,
    minPayout: generalMinPayout,
    maxPayout: generalMaxPayout,
    currentPayout: generalCurrentPayout,
  } = useTvl();

  /* In the current iteration, we only allow claiming for a single windowIndex and each account only has up to 1 account per windowIndex. 
    In a future version, claims[0] won't be destructured and instead the payouts will range accross all the claims array values.
  */
  const claim = claims && claims.length > 0 ? claims[0] : undefined;
  const tvl = tvlData?.currentTvl;
  const metaData = claim?.metaData ?? [];
  const quantity = parseFloat(
    ethers.utils.formatUnits(ethers.BigNumber.from(claim?.amount ?? 0), "ether")
  );
  const minPayout = Math.round(100 * generalMinPayout * quantity) / 100;
  const maxPayout = Math.round(100 * (generalMaxPayout * quantity)) / 100;
  const currentPayout =
    Math.round(100 * (Number(generalCurrentPayout) * quantity)) / 100;
  return {
    quantity,
    tvl,
    minPayout,
    maxPayout,
    currentPayout,
    metaData,
  };
}
