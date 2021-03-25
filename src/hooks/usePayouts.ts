import { ethers } from "ethers";
import { useOptions } from "./useOptions";
import { useTvl } from "./useTvl";

export function usePayouts() {
  const { claims } = useOptions();
  const {
    data: tvlData,
    minPayout: generalMinPayout,
    maxPayout: generalMaxPayout,
    currentPayout: generalCurrentPayout,
  } = useTvl();

  const claim = claims && claims.length > 0 ? claims[0] : undefined;
  const tvl = tvlData?.currentTvl;
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
  };
}
