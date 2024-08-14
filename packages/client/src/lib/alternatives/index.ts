import {
  Currency,
  Price,
  CurrencyAmount as UniswapCurrencyAmount,
} from "@uniswap/sdk-core";
import { Pool as UniswapPool } from "@uniswap/v3-sdk";
import JSBI from "jsbi";

export class CurrencyPrice<
  T extends Currency = Currency,
  V extends Currency = Currency
> extends Price<T, V> {}

export class CurrencyAmount<
  T extends Currency = Currency
> extends UniswapCurrencyAmount<T> {}

const ZERO = JSBI.BigInt(0);
const isZero = (value: JSBI) => JSBI.equal(value, ZERO);

export class Pool extends UniswapPool {
  get isNotLiquidity() {
    return isZero(this.liquidity) || isZero(this.sqrtRatioX96);
  }
}
