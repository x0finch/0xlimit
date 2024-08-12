import {
  Currency,
  CurrencyAmount,
  Fraction,
  Percent,
  Price,
  Token,
} from "@uniswap/sdk-core";
import { encodeSqrtRatioX96, TickMath } from "@uniswap/v3-sdk";
import { CurrencyPrice } from "../alternatives";
import { parseUnits } from "viem";
import { Decimal } from "./numbers";

export const from = (
  baseCurrency: Currency,
  quoteCurrency: Currency,
  price: number | Decimal
) => {
  return new Price({
    baseAmount: CurrencyAmount.fromRawAmount(
      baseCurrency,
      parseUnits("1", baseCurrency.decimals).toString()
    ),
    quoteAmount: CurrencyAmount.fromRawAmount(
      quoteCurrency,
      parseUnits(String(price), quoteCurrency.decimals).toString()
    ),
  });
};

export const toTicker = (price: CurrencyPrice) => {
  const sorted = price.baseCurrency.wrapped.sortsBefore(
    price.quoteCurrency.wrapped
  );

  if (price.asFraction.equalTo(0)) {
    return 0;
  }

  const sqrtRatioX96 = sorted
    ? encodeSqrtRatioX96(price.numerator, price.denominator)
    : encodeSqrtRatioX96(price.denominator, price.numerator);

  return TickMath.getTickAtSqrtRatio(sqrtRatioX96);
};

export const percent = (
  basePrice: CurrencyPrice,
  comparePrice: CurrencyPrice
) => {
  const isBaseCurrencyEqual = basePrice.baseCurrency.equals(
    comparePrice.baseCurrency
  );
  const isQuoteCurrencyEqual = basePrice.quoteCurrency.equals(
    comparePrice.quoteCurrency
  );

  if (!isBaseCurrencyEqual || !isQuoteCurrencyEqual) {
    throw new Error(
      "Prices must have the same base and quote currencies to compare"
    );
  }

  const fraction = comparePrice.subtract(basePrice).divide(basePrice);
  return new Percent(fraction.numerator, fraction.denominator);
};

export const adjust = (
  basePrice: CurrencyPrice,
  percentOrNumber: number | Percent
) => {
  const percent =
    typeof percentOrNumber === "number"
      ? new Percent(percentOrNumber, 100)
      : percentOrNumber;

  const priceChange = basePrice.asFraction.multiply(percent);
  const newPriceFraction = basePrice.asFraction.add(priceChange);

  return new Price(
    basePrice.baseCurrency,
    basePrice.quoteCurrency,
    newPriceFraction.denominator,
    newPriceFraction.numerator
  );
};
