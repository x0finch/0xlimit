import { FeeAmount, nearestUsableTick, TICK_SPACINGS } from "@uniswap/v3-sdk";
import { CurrencyPrice } from "../alternatives";
import { currencies, prices } from "../utils";
import { useMemo } from "react";
import { useRebasePrice } from "./use-sorted";
import { Currency } from "@uniswap/sdk-core";

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
  inputCurrency: Currency,
  marketPrice: CurrencyPrice,
  preferPrice: CurrencyPrice,
  feeAmount: FeeAmount
) => {
  const rebasedMarketPrice = useRebasePrice(inputCurrency, marketPrice);
  const rebasedPreferPrice = useRebasePrice(inputCurrency, preferPrice);

  return useMemo(
    () => calculateTickRange(rebasedMarketPrice, rebasedPreferPrice, feeAmount),
    [feeAmount, rebasedMarketPrice, rebasedPreferPrice]
  );
};
