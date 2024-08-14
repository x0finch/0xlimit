import { Token, Currency } from "@uniswap/sdk-core";

export const DEFAULT_QUOTE_CURRENCIES: { [chainId: number]: Currency } = {
  1: new Token(
    1,
    "0xdac17f958d2ee523a2206206994597c13d831ec7",
    6,
    "USDT",
    "Tether"
  ),
};
