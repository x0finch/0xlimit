import { Price, Token } from "@uniswap/sdk-core";
import { createContext, useContext, useState } from "react";
import { Decimal, prices } from "~/lib";

type TokenPrice = Price<Token, Token>;

const DraftContext = createContext<{
  invert: () => void;
  marketPrice: TokenPrice;
  preferPrice: TokenPrice | null;
  setPreferPrice: React.Dispatch<React.SetStateAction<TokenPrice | null>>;
  inputAmount: Decimal;
  setInputAmount: React.Dispatch<React.SetStateAction<Decimal>>;
  outputAmount: Decimal;
  setOutputAmount: React.Dispatch<React.SetStateAction<Decimal>>;
}>({} as never);

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
const MARKET_PRICE = prices.from(INPUT_TOKEN, OUTPUT_TOKEN, 2516.8);

export const DraftMakerProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [marketPrice, setMarketPrice] = useState(MARKET_PRICE);
  const [preferPrice, setPreferPrice] = useState<TokenPrice | null>(null);
  const [inputAmount, setInputAmount] = useState<Decimal>("");
  const [outputAmount, setOutputAmount] = useState<Decimal>("");

  const invert = () => {
    setMarketPrice(marketPrice.invert());
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
  };

  return (
    <DraftContext.Provider
      value={{
        marketPrice,
        invert,
        preferPrice,
        setPreferPrice,
        inputAmount,
        setInputAmount,
        outputAmount,
        setOutputAmount,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};

export const useDraftMakerContext = () => {
  return useContext(DraftContext);
};
