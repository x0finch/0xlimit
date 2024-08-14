import { FeeAmount, tickToPrice } from "@uniswap/v3-sdk";
import { Currency, Ether, Price, Token } from "@uniswap/sdk-core";
import { useEffect, useMemo, useState } from "react";
import { useMaxOutput } from "~/lib/hooks/use-max-output";
import { currencies, Decimal, prices } from "~/lib/utils";
import { DEFAULT_QUOTE_CURRENCIES } from "~/lib/constants";
import { UserCurrencyId } from "~/lib/types";
import {
  getConstantCurrency,
  useConnectedCurrency,
} from "~/lib/hooks/use-connected-currency";
import { useChainId } from "wagmi";
import { useSearchParams } from "react-router-dom";
import { useV3Pool } from "~/lib/hooks/use-v3-pool";
import { CurrencyPrice } from "~/lib/alternatives";

export const INPUT_CURRENCY_KEY = "in";
export const OUTPUT_CURRENCY_KEY = "out";

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

export const getDefaultQuoteCurrencyOrThrow = (chainId: number) => {
  const defaultQuoteCurrency = DEFAULT_QUOTE_CURRENCIES[chainId];

  if (!defaultQuoteCurrency) {
    throw new Error(`Default quote currency not found on chain ${chainId}`);
  }

  return defaultQuoteCurrency;
};

export const fixPair = (
  chainId: number,
  inputCurrencyId?: string,
  outputCurrencyId?: string
): { base: string; quote: string; redirect: boolean } => {
  const defaultQuoteCurrency = getDefaultQuoteCurrencyOrThrow(chainId);

  const inputCurrencyIdIsValid = currencies.isUserCurrencyId(inputCurrencyId);
  const outputCurrencyIdIsValid = currencies.isUserCurrencyId(outputCurrencyId);

  if (!inputCurrencyIdIsValid && !outputCurrencyIdIsValid) {
    return {
      base: currencies.ETH,
      quote: defaultQuoteCurrency.wrapped.address,
      redirect: true,
    };
  } else if (!inputCurrencyIdIsValid && outputCurrencyIdIsValid) {
    return fixPair(chainId, outputCurrencyId, undefined);
  } else if (inputCurrencyIdIsValid && !outputCurrencyIdIsValid) {
    const inputCurrencyIsETHOrWETH = currencies.isETHOrWETH(
      chainId,
      inputCurrencyId
    );

    if (inputCurrencyIsETHOrWETH) {
      return {
        base: inputCurrencyId,
        quote: defaultQuoteCurrency.wrapped.address,
        redirect: true,
      };
    }

    const inputCurrencyIsDefaultQuote =
      inputCurrencyId.toLowerCase() ===
      defaultQuoteCurrency.wrapped.address.toLowerCase();

    if (inputCurrencyIsDefaultQuote) {
      return {
        base: inputCurrencyId,
        quote: currencies.ETH,
        redirect: true,
      };
    }
  } else if (inputCurrencyIdIsValid && outputCurrencyIdIsValid) {
    const inputCurrencyIsETHOrWETH = currencies.isETHOrWETH(
      chainId,
      inputCurrencyId
    );
    const outputCurrencyIsETHOrWETH = currencies.isETHOrWETH(
      chainId,
      outputCurrencyId
    );

    if (inputCurrencyIsETHOrWETH && outputCurrencyIsETHOrWETH) {
      return {
        base: inputCurrencyId,
        quote: defaultQuoteCurrency.wrapped.address,
        redirect: true,
      };
    }

    return {
      base: inputCurrencyId,
      quote: outputCurrencyId,
      redirect: false,
    };
  }

  throw new Error("Invalid input or output currency");
};

export const createInitCurrency = (
  chainId: number,
  userCurrencyId: UserCurrencyId
) => {
  const constantCurrency = getConstantCurrency(chainId, userCurrencyId);
  return constantCurrency ?? new Token(chainId, userCurrencyId, 18, "Token");
};

export const useConnector = () => {
  const [params] = useSearchParams();
  const userInputCurrencyId = params.get(INPUT_CURRENCY_KEY) as UserCurrencyId;
  const userOutputCurrencyId = params.get(
    OUTPUT_CURRENCY_KEY
  ) as UserCurrencyId;

  const chainId = useChainId();
  const [inputCurrency, setInputCurrency] = useState<Currency>(() =>
    createInitCurrency(chainId, userInputCurrencyId)
  );
  const [outputCurrency, setOutputCurrency] = useState<Currency>(() =>
    createInitCurrency(chainId, userOutputCurrencyId)
  );
  const [marketPrice, setMarketPrice] = useState<CurrencyPrice>(() =>
    prices.from(inputCurrency, outputCurrency, 1)
  );

  const {
    pool,
    error: poolError,
    isLoading: isPoolLoading,
  } = useV3Pool(inputCurrency, outputCurrency, FeeAmount.LOW);

  useEffect(() => {
    if (!pool) {
      return;
    }

    setMarketPrice((prev) => {
      const price = pool.priceOf(prev.baseCurrency.wrapped);

      return new Price(
        prev.baseCurrency,
        prev.quoteCurrency,
        price.denominator,
        price.numerator
      );
    });
  }, [pool]);

  const {
    currency: connectedInputCurrency,
    isLoading: isInputLoading,
    error: inputCurrencyError,
  } = useConnectedCurrency(userInputCurrencyId);
  const {
    currency: connectedOutputCurrency,
    isLoading: isOutputLoading,
    error: outputCurrencyError,
  } = useConnectedCurrency(userOutputCurrencyId);

  useEffect(() => {
    if (!connectedInputCurrency || !connectedOutputCurrency) {
      return;
    }

    setInputCurrency(connectedInputCurrency);
    setOutputCurrency(connectedOutputCurrency);
    setMarketPrice((prev) => {
      const [baseCurrency, quoteCurrency] = prev.baseCurrency.equals(
        connectedInputCurrency
      )
        ? [connectedInputCurrency, connectedOutputCurrency]
        : [connectedOutputCurrency, connectedInputCurrency];

      return new Price(
        baseCurrency,
        quoteCurrency,
        prev.denominator,
        prev.numerator
      );
    });
  }, [connectedInputCurrency, connectedOutputCurrency]);

  const isLoading = isInputLoading || isOutputLoading || isPoolLoading;
  const error = inputCurrencyError || outputCurrencyError || poolError;

  return {
    inputCurrency,
    outputCurrency,
    marketPrice,
    isLoading,
    error,
    setMarketPrice,
    setInputCurrency,
    setOutputCurrency,
  };
};
