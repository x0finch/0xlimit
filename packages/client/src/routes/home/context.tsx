import { Token } from "@uniswap/sdk-core";
import { createContext, useContext, useMemo, useState } from "react";
import { Decimal, prices } from "~/lib/utils";
import { TokenPrice } from "./helper";
import { FeeAmount } from "@uniswap/v3-sdk";

const DraftContext = createContext<{
  invert: () => void;
  token0: Token;
  token1: Token;
  marketPrice: TokenPrice;
  preferPrice: TokenPrice | null;
  setPreferPrice: React.Dispatch<React.SetStateAction<TokenPrice | null>>;
  inputAmount: Decimal;
  setInputAmount: React.Dispatch<React.SetStateAction<Decimal>>;
  outputAmount: Decimal;
  setOutputAmount: React.Dispatch<React.SetStateAction<Decimal>>;
  feeAmount: FeeAmount;
  setFeeAmount: React.Dispatch<React.SetStateAction<FeeAmount>>;
}>({} as never);

const weth = new Token(
  1,
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  18,
  "ETH"
);
const usdc = new Token(
  1,
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  6,
  "USDC"
);
const wbtc = new Token(
  1,
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  8,
  "WBTC"
);
const MARKET_PRICE = prices.from(weth, wbtc, 0.005); //prices.from(weth, usdc, 2516.8);

export const DraftMakerProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [feeAmount, setFeeAmount] = useState<FeeAmount>(FeeAmount.LOW);
  const [marketPrice, setMarketPrice] = useState(MARKET_PRICE);
  const [preferPrice, setPreferPrice] = useState<TokenPrice | null>(null);
  const [inputAmount, setInputAmount] = useState<Decimal>("");
  const [outputAmount, setOutputAmount] = useState<Decimal>("");

  const { baseCurrency, quoteCurrency } = marketPrice;
  const [token0, token1] = useMemo(() => {
    const tokens = [baseCurrency, quoteCurrency];
    const baseTokenSmaller = marketPrice.baseCurrency.sortsBefore(
      marketPrice.quoteCurrency
    );
    return baseTokenSmaller ? tokens : tokens.reverse();
  }, [marketPrice.baseCurrency, marketPrice.quoteCurrency]);

  const invert = () => {
    setMarketPrice(marketPrice.invert());
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
  };

  return (
    <DraftContext.Provider
      value={{
        feeAmount,
        setFeeAmount,
        marketPrice,
        invert,
        preferPrice,
        setPreferPrice,
        inputAmount,
        setInputAmount,
        outputAmount,
        setOutputAmount,
        token0,
        token1,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};

export const useDraftMakerContext = () => {
  return useContext(DraftContext);
};
