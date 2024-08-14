import { Currency, Price } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { currencies } from "../utils";
import { CurrencyPrice } from "../alternatives";

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

export const useRebasePrice = (
  baseCurrency: Currency,
  price: CurrencyPrice
) => {
  return useMemo(() => {
    const baseCurrencyIsTheSame = baseCurrency.equals(price.baseCurrency);
    if (baseCurrencyIsTheSame) {
      return price;
    }

    return price.invert();
  }, [baseCurrency, price]);
};
