import { Currency } from "@uniswap/sdk-core";
import { maxLiquidityForAmounts, TickMath } from "@uniswap/v3-sdk";
import JSBI from "jsbi";
import { useMemo } from "react";
import { parseUnits } from "viem";
import { CurrencyAmount } from "~/lib/alternatives";
import { currencies, Decimal } from "~/lib/utils";

const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));

export const calculateMaxOutput = (
  inputAmount: Decimal,
  inputCurrency: Currency,
  outputCurrency: Currency,
  minTicker: number,
  maxTicker: number
) => {
  const sorted = currencies.isSorted(inputCurrency, outputCurrency);

  const inputCurrencyAmount = CurrencyAmount.fromRawAmount(
    inputCurrency,
    parseUnits(inputAmount, inputCurrency.decimals).toString()
  );

  const lowerSqrt = TickMath.getSqrtRatioAtTick(minTicker);
  const upperSqrt = TickMath.getSqrtRatioAtTick(maxTicker);

  const [fakeCurSqrt, amount0, amount1] = sorted
    ? [lowerSqrt, inputCurrencyAmount.quotient, 0]
    : [upperSqrt, 0, inputCurrencyAmount.quotient];

  const liquidity = maxLiquidityForAmounts(
    fakeCurSqrt,
    lowerSqrt,
    upperSqrt,
    amount0,
    amount1,
    true
  );

  const maxOutput = sorted
    ? calculateMaxAmount1(liquidity, lowerSqrt, upperSqrt)
    : calculateMaxAmount0(liquidity, lowerSqrt, upperSqrt);

  return CurrencyAmount.fromRawAmount(outputCurrency, maxOutput);
};

const calculateMaxAmount0 = (
  liquidity: JSBI,
  sqrtRatioAX96: JSBI,
  sqrtRatioBX96: JSBI
) => {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }

  return JSBI.divide(
    JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(liquidity, Q96),
        JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96)
      ),
      sqrtRatioBX96
    ),
    sqrtRatioAX96
  );
};

const calculateMaxAmount1 = (
  liquidity: JSBI,
  sqrtRatioAX96: JSBI,
  sqrtRatioBX96: JSBI
) => {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }

  return JSBI.divide(
    JSBI.multiply(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96)),
    Q96
  );
};

export const useMaxOutput = (
  inputAmount: Decimal,
  inputCurrency: Currency,
  outputCurrency: Currency,
  tickLower: number,
  tickUpper: number
) => {
  return useMemo(() => {
    return calculateMaxOutput(
      inputAmount,
      inputCurrency,
      outputCurrency,
      tickLower,
      tickUpper
    );
  }, [inputAmount, inputCurrency, outputCurrency, tickLower, tickUpper]);
};
