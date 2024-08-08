import { CurrencyAmount, Price, Token } from "@uniswap/sdk-core";
import { encodeSqrtRatioX96, TickMath } from "@uniswap/v3-sdk";

export const from = (baseToken: Token, quoteToken: Token, price: number) => {
  return new Price({
    baseAmount: CurrencyAmount.fromRawAmount(
      baseToken,
      Math.pow(10, baseToken.decimals)
    ),
    quoteAmount: CurrencyAmount.fromRawAmount(
      quoteToken,
      Math.floor(price * Math.pow(10, quoteToken.decimals))
    ),
  });
};

export const toTicker = (price: Price<Token, Token>) => {
  const sorted = price.baseCurrency.sortsBefore(price.quoteCurrency);

  const sqrtRatioX96 = sorted
    ? encodeSqrtRatioX96(price.numerator, price.denominator)
    : encodeSqrtRatioX96(price.denominator, price.numerator);

  return TickMath.getTickAtSqrtRatio(sqrtRatioX96);
};
