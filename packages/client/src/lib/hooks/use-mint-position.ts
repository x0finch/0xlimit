import { CurrencyPrice } from "../alternatives";
import {
  Currency,
  Percent,
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
} from "@uniswap/sdk-core";
import {
  FeeAmount,
  NonfungiblePositionManager,
  Position,
} from "@uniswap/v3-sdk";
import { currencies, Decimal } from "../utils";
import { Address, Hex, parseUnits } from "viem";
import { useAccount, useSendTransaction } from "wagmi";
import { useV3Pool } from "./use-v3-pool";
import { useTickRange } from "./use-tick-range";

export const useMintPosition = (
  inputCurrency: Currency,
  outputCurrency: Currency,
  inputAmount: Decimal,
  feeAmount: FeeAmount,
  marketPrice: CurrencyPrice,
  preferPrice: CurrencyPrice
) => {
  const account = useAccount();
  const { sendTransactionAsync, isPending, isSuccess, error } =
    useSendTransaction();

  const { pool, isLoading: isLoadingPool } = useV3Pool(
    inputCurrency,
    outputCurrency,
    feeAmount
  );

  const [tickLower, tickUpper] = useTickRange(
    inputCurrency,
    marketPrice,
    preferPrice,
    feeAmount
  );

  const mint = async (
    deadline: number,
    slippageTolerance = new Percent(50, 10_000)
  ) => {
    const { chainId, address } = account;

    if (!chainId || !address) {
      throw new Error("No account connected");
    } else if (isLoadingPool) {
      throw new Error("Pool is loading");
    } else if (!pool || pool.isNotLiquidity) {
      throw new Error("Pool is not liquidity");
    }

    const [currency0] = currencies.sorted(inputCurrency, outputCurrency);
    const currency0IsInput = inputCurrency.equals(currency0);

    const inputAmountBigInt = parseUnits(inputAmount, inputCurrency.decimals);

    const position = Position.fromAmounts({
      pool,
      tickLower,
      tickUpper,
      amount0: currency0IsInput ? inputAmountBigInt.toString() : 0,
      amount1: currency0IsInput ? 0 : inputAmountBigInt.toString(),
      useFullPrecision: true,
    });

    const { calldata, value } = NonfungiblePositionManager.addCallParameters(
      position,
      {
        recipient: address,
        deadline,
        slippageTolerance,
        createPool: pool.isNotLiquidity,
        useNative: inputCurrency.isNative ? inputCurrency : undefined,
      }
    );

    return sendTransactionAsync({
      to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] as Address,
      data: calldata as Hex,
      value: BigInt(value),
    });
  };

  return {
    mint,
    pool,
    isLoadingPool,
    isPending,
    isSuccess,
    error: error as Error,
  };
};
