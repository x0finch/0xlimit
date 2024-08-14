import { Currency } from "@uniswap/sdk-core";
import { tickToPrice } from "@uniswap/v3-sdk";
import { useMemo } from "react";
import { useMaxOutput } from "~/lib/hooks/use-max-output";
import { currencies, Decimal, prices } from "~/lib/utils";

export const usePriceRange = (
  baseCurrency: Currency,
  quoteCurrency: Currency,
  tickLower: number,
  tickUpper: number
) => {
  return useMemo(() => {
    const sorted = currencies.isSorted(baseCurrency, quoteCurrency);
    const results = [
      tickToPrice(baseCurrency.wrapped, quoteCurrency.wrapped, tickLower),
      tickToPrice(baseCurrency.wrapped, quoteCurrency.wrapped, tickUpper),
    ];
    return sorted ? results : results.reverse();
  }, [baseCurrency, quoteCurrency, tickLower, tickUpper]);
};

export const useEstimateAvgPrice = (
  inputAmount: Decimal,
  inputCurrency: Currency,
  outputCurrency: Currency,
  tickLower: number,
  tickUpper: number
) => {
  const maxOutput = useMaxOutput(
    inputAmount,
    inputCurrency,
    outputCurrency,
    tickLower,
    tickUpper
  );

  return useMemo(() => {
    return prices.from(
      inputCurrency,
      outputCurrency,
      Number(maxOutput.toSignificant()) / Number(inputAmount)
    );
  }, [inputCurrency, outputCurrency, inputAmount, maxOutput]);
};
