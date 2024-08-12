import {
  Currency,
  Price,
  CurrencyAmount as UniswapCurrencyAmount,
} from "@uniswap/sdk-core";

export class CurrencyPrice<
  T extends Currency = Currency,
  V extends Currency = Currency
> extends Price<T, V> {}

export class CurrencyAmount<
  T extends Currency = Currency
> extends UniswapCurrencyAmount<T> {}
