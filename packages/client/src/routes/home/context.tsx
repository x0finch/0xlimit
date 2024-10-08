import { Currency } from "@uniswap/sdk-core";
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
  setFeeAmount: (value: FeeAmount) => void;

  transactionDeadline: number;
  setTransactionDeadline: (value: number) => void;

  toggleInputOutputCurrencies: () => void;
  toggleBaseQuoteCurrencies: () => void;
}>({} as never);

const rebasePrice = (
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

export const DraftStateProvider: React.FC<
  React.PropsWithChildren<{
    inputCurrency: Currency;
    outputCurrency: Currency;
    marketPrice: CurrencyPrice;
    feeAmount: FeeAmount;
    setFeeAmount: (value: FeeAmount) => void;
    toggleInputOutputCurrencies: () => void;
    toggleBaseQuoteCurrencies: () => void;
    transactionDeadline: number;
    setTransactionDeadline: (value: number) => void;
  }>
> = ({
  children,
  inputCurrency,
  outputCurrency,
  marketPrice,
  toggleInputOutputCurrencies: toggleInputOutputCurrenciesOuter,
  toggleBaseQuoteCurrencies: toggleBaseQuoteCurrenciesOuter,
  feeAmount,
  setFeeAmount,
  transactionDeadline,
  setTransactionDeadline,
}) => {
  const [inputPrice, setInputPrice] = useState<Decimal | null>(null);
  const [inputAmount, setInputAmount] = useState<Decimal>("");
  const [outputAmount, setOutputAmount] = useState<Decimal>("");
  // const [feeAmount, setFeeAmount] = useState<FeeAmount>(FeeAmount.LOW);

  const [priceBaseOnInput, priceBaseOnOutput] = useMemo(
    () => rebasePrice(marketPrice, inputPrice, inputCurrency),
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
    const [newPriceBaseOnInput] = rebasePrice(
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
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
    toggleInputOutputCurrenciesOuter();
  };

  const toggleBaseQuoteCurrencies = () => {
    toggleBaseQuoteCurrenciesOuter();

    const invertedMarketPrice = marketPrice.invert();

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

        transactionDeadline,
        setTransactionDeadline,
      }}
    >
      {children}
    </DraftState.Provider>
  );
};

export const useDraftState = () => {
  return useContext(DraftState);
};
