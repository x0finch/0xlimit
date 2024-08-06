import { CurrencyAmount, Price, Token } from "@uniswap/sdk-core";

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
