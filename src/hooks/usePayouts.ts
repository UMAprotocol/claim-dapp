import React from "react";
import { getOptionsDollarValue } from "../utils";
import { useOptions } from "./useOptions";
import { usePrice, useTvl } from "./usePrice";

export function usePayouts() {
  const { claims } = useOptions();
  const { data: priceData } = usePrice();
  const { data: tvlData } = useTvl();

  const claim = claims && claims.length > 0 ? claims[0] : undefined;
  const price = priceData?.uma.usd;
  const tvl = tvlData?.currentTvl;
  const payouts = React.useMemo(() => {
    if (price && tvl && claim) {
      return getOptionsDollarValue(claim.amount, price, tvl);
    }
  }, [claim, price, tvl]);

  return payouts;
}
