import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { Address, erc20Abi } from "viem";
import { useBalance, useReadContract } from "wagmi";
import { objects } from "../utils";

export const useCurrencyAmountOf = (
  address: Address | undefined,
  currency: Currency
) => {
  const nativeBalance = useBalance({
    address,
    query: { enabled: currency.isNative },
  });

  const tokenBalance = useReadContract({
    abi: erc20Abi,
    functionName: "balanceOf",
    address: currency.isNative
      ? undefined
      : (currency.wrapped.address as Address),
    args: [address!],
    query: { enabled: currency.isToken },
  });

  return useMemo(() => {
    const value = currency.isNative
      ? nativeBalance.data?.value
      : tokenBalance.data;
    const rest = currency.isNative
      ? objects.omit(nativeBalance, "data")
      : objects.omit(tokenBalance, "data");

    const amount =
      typeof value === "bigint"
        ? CurrencyAmount.fromRawAmount(currency, value.toString())
        : undefined;

    return { data: amount, ...rest };
  }, [currency, nativeBalance, tokenBalance]);
};
