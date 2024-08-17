import { ChainId } from "@uniswap/sdk-core";

export const TOKEN_LIST_MAPPING: { [chainId: number]: string } = {
  [ChainId.MAINNET]: "https://tokens.coingecko.com/uniswap/all.json",
};
