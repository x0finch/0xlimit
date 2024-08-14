import { Currency, Ether } from "@uniswap/sdk-core";
import { UserCurrencyId } from "../types";
import { Address, isAddress } from "viem";

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

export const ETH = "ETH";

export const isETHOrWETH = (chainId: number, currencyId: string) => {
  return (
    currencyId === ETH ||
    currencyId.toLowerCase() ===
      Ether.onChain(chainId).wrapped.address.toLowerCase()
  );
};

export const getUserCurrencyId = (currency: Currency): UserCurrencyId => {
  return currency.isNative ? ETH : (currency.wrapped.address as Address);
};

export const isUserCurrencyId = (
  currencyId?: string
): currencyId is UserCurrencyId => {
  return Boolean(currencyId) && (currencyId === ETH || isAddress(currencyId!));
};
