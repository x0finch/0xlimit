import { FeeAmount, nearestUsableTick, TICK_SPACINGS } from "@uniswap/v3-sdk";
import { CurrencyPrice } from "../alternatives";
import { currencies, prices } from "../utils";
import { useMemo } from "react";
import { useSortedPrice } from "./use-sorted";

export const calculateTickRange = (
  marketPrice: CurrencyPrice,
  preferPrice: CurrencyPrice,
  feeAmount: FeeAmount
) => {
  const tickSpacing = TICK_SPACINGS[feeAmount];
  const sorted = currencies.isSorted(
    marketPrice.baseCurrency,
    marketPrice.quoteCurrency
  );

  const marketTick = prices.toTick(marketPrice);
  const preferTick = prices.toTick(preferPrice);

  const roundedPreferTick = nearestUsableTick(preferTick, tickSpacing);
  let tickLower: number, tickUpper: number;

  if (sorted) {
    tickLower =
      roundedPreferTick <= marketTick
        ? roundedPreferTick + tickSpacing
        : roundedPreferTick;

    tickUpper = tickLower + tickSpacing;
  } else {
    tickUpper =
      roundedPreferTick >= marketTick
        ? roundedPreferTick - tickSpacing
        : roundedPreferTick;

    tickLower = tickUpper - tickSpacing;
  }

  return [tickLower, tickUpper];
};

export const useTickRange = (
  marketPrice: CurrencyPrice,
  preferPrice: CurrencyPrice,
  feeAmount: FeeAmount
) => {
  const sortedMarketPrice = useSortedPrice(marketPrice);
  const sortedPreferPrice = useSortedPrice(preferPrice);

  return useMemo(
    () => calculateTickRange(sortedMarketPrice, sortedPreferPrice, feeAmount),
    [feeAmount, sortedMarketPrice, sortedPreferPrice]
  );
};
