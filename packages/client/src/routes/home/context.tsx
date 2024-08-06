import { Price, Token } from "@uniswap/sdk-core";
import { createContext, useContext, useState } from "react";
import { prices } from "~/lib";

const DraftContext = createContext({
  // inputToken: {} as Token,
  // outputToken: {} as Token,
  invert: () => { },
  marketPrice: {} as Price<Token, Token>,
  preferPrice: 0 as number,
  setPreferPrice: (_value: number) => { }
});

const INPUT_TOKEN = new Token(
  1,
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  18,
  "ETH"
);
const OUTPUT_TOKEN = new Token(
  1,
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  6,
  "USDC"
);
const MARKET_PRICE = prices.from(INPUT_TOKEN, OUTPUT_TOKEN, 2506.14);

export const DraftMakerProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [marketPrice, setMarketPrice] = useState(MARKET_PRICE);
  const [preferPrice, setPreferPrice] = useState(0)

  const invert = () => {
    setMarketPrice(marketPrice.invert());
  }

  return (
    <DraftContext.Provider
      value={{
        marketPrice,
        invert,
        preferPrice,
        setPreferPrice,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};

export const useDraftMakerContext = () => {
  return useContext(DraftContext);
}