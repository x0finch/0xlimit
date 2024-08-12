import { Currency } from "@uniswap/sdk-core";
import {
  FeeAmount,
  maxLiquidityForAmounts,
  nearestUsableTick,
  TICK_SPACINGS,
  TickMath,
} from "@uniswap/v3-sdk";
import JSBI from "jsbi";
import { parseUnits } from "viem";
import { CurrencyAmount, CurrencyPrice } from "~/lib/alternatives";
import { Decimal, prices } from "~/lib/utils";

const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));

export const calculateTickerRange = (
  feeAmount: FeeAmount,
  marketPrice: CurrencyPrice,
  preferPrice: CurrencyPrice
) => {
  const tickerSpacing = TICK_SPACINGS[feeAmount];
  const sorted = marketPrice.baseCurrency.wrapped.sortsBefore(
    marketPrice.quoteCurrency.wrapped
  );

  const marketTicker = prices.toTicker(marketPrice);
  const preferTicker = prices.toTicker(preferPrice);

  const roundedPreferTicker = nearestUsableTick(preferTicker, tickerSpacing);
  let minTicker: number, maxTicker: number;

  if (sorted) {
    minTicker =
      roundedPreferTicker <= marketTicker
        ? roundedPreferTicker + tickerSpacing
        : roundedPreferTicker;

    maxTicker = minTicker + tickerSpacing;
  } else {
    maxTicker =
      roundedPreferTicker >= marketTicker
        ? roundedPreferTicker - tickerSpacing
        : roundedPreferTicker;

    minTicker = maxTicker - tickerSpacing;
  }

  return { minTicker, maxTicker };
};

export const calculateMaxOutput = (
  inputAmount: Decimal,
  inputCurrency: Currency,
  outputCurrency: Currency,
  minTicker: number,
  maxTicker: number
) => {
  const sorted = inputCurrency.wrapped.sortsBefore(outputCurrency.wrapped);

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
