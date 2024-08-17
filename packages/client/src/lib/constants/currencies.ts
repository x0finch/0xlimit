import { Token, Currency, ChainId } from "@uniswap/sdk-core";

export const DEFAULT_QUOTE_CURRENCIES: { [chainId: number]: Currency } = {
  1: new Token(
    1,
    "0xdac17f958d2ee523a2206206994597c13d831ec7",
    6,
    "USDT",
    "Tether"
  ),
};

export const TOKEN_INFO_LIST_MAPPING: { [chainId: number]: string } = {
  [ChainId.MAINNET]: "https://tokens.coingecko.com/uniswap/all.json",
};

export const NATIVE_TOKEN_INFO = {
  address: "",
  decimals: 18,
  symbol: "ETH",
  name: "Ethereum",
  logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
};
