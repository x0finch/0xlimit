import { Currency, Ether, Token } from "@uniswap/sdk-core";
import { createContext, useContext, useMemo, useState } from "react";
import { Decimal, prices } from "~/lib/utils";
import { FeeAmount } from "@uniswap/v3-sdk";
import { CurrencyPrice, CurrencyAmount } from "~/lib/alternatives";
import { parseUnits } from "viem";

const DraftState = createContext<{
  inputCurrency: Currency;
  outputCurrency: Currency;

  marketPrice: CurrencyPrice;
  priceBaseOnInput: CurrencyPrice;
  priceBaseOnOutput: CurrencyPrice;
  inputPrice: Decimal;
  onInputPriceChange: (value: Decimal | null) => void;

  inputAmount: Decimal;
  onInputAmountChange: (value: Decimal) => void;

  outputAmount: Decimal;
  onOutputAmountChange: (value: Decimal) => void;

  feeAmount: FeeAmount;
  setFeeAmount: React.Dispatch<React.SetStateAction<FeeAmount>>;

  toggleInputOutputCurrencies: () => void;
  toggleBaseQuoteCurrencies: () => void;
}>({} as never);

const eth = Ether.onChain(1);
// const weth = new Token(
//   1,
//   "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
//   18,
//   "ETH"
// );
// const usdc = new Token(
//   1,
//   "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
//   6,
//   "USDC"
// );
const wbtc = new Token(
  1,
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  8,
  "WBTC"
);

const transformPrice = (
  marketPrice: CurrencyPrice,
  inputPrice: Decimal | null,
  inputCurrency: Currency
) => {
  const inputCurrencyIsBaseCurrency = inputCurrency.equals(
    marketPrice.baseCurrency
  );

  const price =
    inputPrice === null
      ? marketPrice
      : prices.from(
          marketPrice.baseCurrency,
          marketPrice.quoteCurrency,
          inputPrice
        );

  return inputCurrencyIsBaseCurrency
    ? [price, price.invert()]
    : [price.invert(), price];
};

export const DraftStateProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [inputCurrency, setInputCurrency] = useState<Currency>(eth);
  const [outputCurrency, setOutputCurrency] = useState<Currency>(wbtc);

  const [marketPrice, setMarketPrice] = useState(
    prices.from(inputCurrency, outputCurrency, 0.05)
  );

  const [inputPrice, setInputPrice] = useState<Decimal | null>(null);
  const [inputAmount, setInputAmount] = useState<Decimal>("");
  const [outputAmount, setOutputAmount] = useState<Decimal>("");
  const [feeAmount, setFeeAmount] = useState<FeeAmount>(FeeAmount.LOW);

  const [priceBaseOnInput, priceBaseOnOutput] = useMemo(
    () => transformPrice(marketPrice, inputPrice, inputCurrency),
    [marketPrice, inputPrice, inputCurrency]
  );

  const onInputAmountChange = (newInputAmount: Decimal) => {
    const newOutputAmount = priceBaseOnInput.quote(
      CurrencyAmount.fromRawAmount(
        inputCurrency,
        parseUnits(newInputAmount, inputCurrency.decimals).toString()
      )
    );

    setInputAmount(newInputAmount);
    setOutputAmount(newOutputAmount.toExact() as Decimal);
  };

  const onOutputAmountChange = (newOutputAmount: Decimal) => {
    const newInputAmount = priceBaseOnOutput.quote(
      CurrencyAmount.fromRawAmount(
        outputCurrency,
        parseUnits(newOutputAmount, outputCurrency.decimals).toString()
      )
    );

    setInputAmount(newInputAmount.toExact() as Decimal);
    setOutputAmount(newOutputAmount);
  };

  const onInputPriceChange = (value: Decimal | null) => {
    setInputPrice(value);
    const [newPriceBaseOnInput] = transformPrice(
      marketPrice,
      value,
      inputCurrency
    );

    const newOutputAmount = newPriceBaseOnInput.quote(
      CurrencyAmount.fromRawAmount(
        inputCurrency,
        parseUnits(inputAmount, inputCurrency.decimals).toString()
      )
    );
    setOutputAmount(newOutputAmount.toSignificant() as Decimal);
  };

  const toggleInputOutputCurrencies = () => {
    setInputCurrency(outputCurrency);
    setOutputCurrency(inputCurrency);
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
  };

  const toggleBaseQuoteCurrencies = () => {
    const invertedMarketPrice = marketPrice.invert();
    setMarketPrice(invertedMarketPrice);

    if (inputPrice !== null) {
      const newInputPrice = invertedMarketPrice.baseCurrency.equals(
        inputCurrency
      )
        ? priceBaseOnInput
        : priceBaseOnOutput;
      setInputPrice(newInputPrice.toSignificant() as Decimal);
    }
  };

  return (
    <DraftState.Provider
      value={{
        inputCurrency,
        outputCurrency,

        feeAmount,
        setFeeAmount,

        marketPrice,
        inputPrice: inputPrice ?? (marketPrice.toSignificant() as Decimal),
        onInputPriceChange,

        priceBaseOnInput,
        priceBaseOnOutput,
        inputAmount,
        onInputAmountChange,
        outputAmount,
        onOutputAmountChange,

        toggleInputOutputCurrencies,
        toggleBaseQuoteCurrencies,
      }}
    >
      {children}
    </DraftState.Provider>
  );
};

export const useDraftState = () => {
  return useContext(DraftState);
};
