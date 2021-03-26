import { ethers } from "ethers";
import { useOptionsClaim } from "./useOptionsClaim";
import { useTvl } from "./useTvl";

export function usePayouts() {
  const { claims } = useOptionsClaim();
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
  const minPayout = generalMinPayout * quantity;
  const maxPayout = generalMaxPayout * quantity;
  const currentPayout = Number(generalCurrentPayout) * quantity;
  return {
    quantity,
    tvl,
    minPayout,
    maxPayout,
    currentPayout,
    metaData,
  };
}
