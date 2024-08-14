import { Currency, Price } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { currencies } from "../utils";

export const useSortedCurrencies = (
  currencyA: Currency,
  currencyB: Currency
) => {
  return useMemo(() => {
    return currencies.sorted(currencyA, currencyB) as [Currency, Currency];
  }, [currencyA, currencyB]);
};

export const useSortedPrice = <TBase extends Currency, TQuote extends Currency>(
  price: Price<TBase, TQuote>
) => {
  return useMemo(() => {
    const sorted = currencies.isSorted(price.baseCurrency, price.quoteCurrency);
    return sorted ? price : price.invert();
  }, [price]);
};
