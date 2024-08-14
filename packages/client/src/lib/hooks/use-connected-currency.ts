import { Address, erc20Abi } from "viem";
import { UserCurrencyId } from "../types";
import { Ether, Token } from "@uniswap/sdk-core";
import { useChainId, useReadContracts } from "wagmi";
import { currencies } from "../utils";
import { useMemo } from "react";
import { DEFAULT_QUOTE_CURRENCIES } from "../constants";

const CONSTANT_STATUS = {
  isLoading: false,
  isPending: false,
  isSuccess: true,
  error: null,
};

export const getConstantCurrency = (
  chainId: number,
  currencyId: UserCurrencyId
) => {
  const ether = Ether.onChain(chainId);

  if (currencyId === currencies.ETH) {
    return ether;
  } else if (currencyId.toLowerCase() === ether.wrapped.address.toLowerCase()) {
    return ether.wrapped;
  }

  const defaultQuoteCurrency = DEFAULT_QUOTE_CURRENCIES[chainId];
  if (
    defaultQuoteCurrency?.wrapped.address.toLowerCase() ===
    currencyId.toLowerCase()
  ) {
    return defaultQuoteCurrency;
  }

  return null;
};

export const useConnectedCurrency = (currencyId: UserCurrencyId) => {
  const chainId = useChainId();
  const constantCurrency = useMemo(
    () => getConstantCurrency(chainId, currencyId),
    [chainId, currencyId]
  );

  const { data, isLoading, isPending, isSuccess, error } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: currencyId as Address,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: currencyId as Address,
        abi: erc20Abi,
        functionName: "symbol",
      },
      {
        address: currencyId as Address,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ],
    query: { enabled: !constantCurrency },
  });

  const currency = useMemo(() => {
    if (constantCurrency) {
      return constantCurrency;
    }

    if (!data) {
      return null;
    }

    const [name, symbol, decimals] = data;
    return new Token(chainId, currencyId, decimals, symbol, name);
  }, [constantCurrency, data]);

  const status = constantCurrency
    ? CONSTANT_STATUS
    : {
        isLoading,
        isPending,
        isSuccess,
        error: error as Error | null,
      };

  return { currency, ...status };
};
