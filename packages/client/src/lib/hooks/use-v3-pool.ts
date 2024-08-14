import { Currency } from "@uniswap/sdk-core";
import { FeeAmount, priceToClosestTick, TickMath } from "@uniswap/v3-sdk";
import { useSortedCurrencies } from "./use-sorted";
import { useCallback, useMemo } from "react";
import { useReadContracts } from "wagmi";
import { Address } from "viem";
import { uniswapV3PoolAbi } from "../abis/uniswap-v3-pool";
import { prices } from "../utils";
import { CurrencyPrice, Pool } from "../alternatives";
import { ArrayToTuple } from "../types";

export const useV3Pool = (
  currencyA: Currency,
  currencyB: Currency,
  feeAmount: FeeAmount
) => {
  const [currency0, currency1] = useSortedCurrencies(currencyA, currencyB);

  const poolAddress = useMemo(
    () =>
      Pool.getAddress(
        currency0.wrapped,
        currency1.wrapped,
        feeAmount
      ) as Address,
    [currency0, currency1, feeAmount]
  );

  const { data, isLoading, isPending, isSuccess, error, dataUpdatedAt } =
    useReadContracts({
      allowFailure: true,
      contracts: [
        {
          address: poolAddress,
          abi: uniswapV3PoolAbi,
          functionName: "liquidity",
        },
        {
          address: poolAddress,
          abi: uniswapV3PoolAbi,
          functionName: "slot0",
        },
      ],
    });

  const pool = useMemo(() => {
    if (!data || data.every((item) => item.status !== "success")) {
      return undefined;
    }

    const successData = data
      .filter((item) => item.status === "success")
      .map((item) => item.result);

    const [liquidity, slot0] = successData as ArrayToTuple<typeof successData>;
    const [sqrtPriceX96, tick] = slot0;

    return new Pool(
      currency0.wrapped,
      currency1.wrapped,
      feeAmount,
      sqrtPriceX96.toString(),
      liquidity.toString(),
      tick
    );
  }, [currency0, currency1, feeAmount, data]);

  // console.log("pool: ", {
  //   feeAmount,
  //   poolAddress,
  //   pool,
  //   isNotExist: pool?.isNotExist,
  // });

  const createInitialPool = useCallback(
    (marketPrice: CurrencyPrice) => {
      const currentTick = priceToClosestTick(
        prices.unwrappedPrice(marketPrice)
      );
      const currentSqrt = TickMath.getSqrtRatioAtTick(currentTick);

      return new Pool(
        currency0.wrapped,
        currency1.wrapped,
        feeAmount,
        currentSqrt,
        "0",
        currentTick,
        []
      );
    },
    [currency0, currency1, feeAmount]
  );

  return {
    pool,
    poolAddress,
    createInitialPool,
    isLoading,
    isPending,
    isSuccess,
    error: error as Error,
    dataUpdatedAt,
  };
};