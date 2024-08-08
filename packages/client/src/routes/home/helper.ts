import { CurrencyAmount, Price, Token } from "@uniswap/sdk-core";
import {
  FeeAmount,
  maxLiquidityForAmounts,
  nearestUsableTick,
  TICK_SPACINGS,
  TickMath,
} from "@uniswap/v3-sdk";
import JSBI from "jsbi";
import { prices } from "~/lib";

export type TokenPrice = Price<Token, Token>;
export type TokenAmount = CurrencyAmount<Token>;

const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));

export const calculateTickerRange = (
  feeAmount: FeeAmount,
  marketPrice: TokenPrice,
  preferPrice: TokenPrice | null
) => {
  const tickerSpacing = TICK_SPACINGS[feeAmount];
  const sorted = marketPrice.baseCurrency.sortsBefore(
    marketPrice.quoteCurrency
  );

  const marketTicker = prices.toTicker(marketPrice);
  const preferTicker = preferPrice
    ? prices.toTicker(preferPrice)
    : marketTicker;

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
  inputAmount: TokenAmount,
  outputToken: Token,
  minTicker: number,
  maxTicker: number
) => {
  const sorted = inputAmount.currency.sortsBefore(outputToken);
  const lowerSqrt = TickMath.getSqrtRatioAtTick(minTicker);
  const upperSqrt = TickMath.getSqrtRatioAtTick(maxTicker);

  const [fakeCurSqrt, amount0, amount1] = sorted
    ? [lowerSqrt, inputAmount.quotient, 0]
    : [upperSqrt, 0, inputAmount.quotient];

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

  return CurrencyAmount.fromRawAmount(outputToken, maxOutput);
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
