import { Currency } from "@uniswap/sdk-core";

export const sorted = (...currencies: Currency[]) => {
  return currencies.sort((a, b) => (a.wrapped.sortsBefore(b.wrapped) ? -1 : 1));
};

export const isSorted = (...currencies: Currency[]) => {
  return currencies.every((currency, i, arr) => {
    if (i === arr.length - 1) {
      return true;
    }

    return currency.wrapped.sortsBefore(arr[i + 1].wrapped);
  });
};
