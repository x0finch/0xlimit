import { useSearchParams } from "react-router-dom";
import { UserCurrencyId } from "~/lib/types";
import {
  INPUT_CURRENCY_KEY,
  OUTPUT_CURRENCY_KEY,
  useConnector,
} from "./helper";
import React from "react";
import { currencies } from "~/lib/utils";
import { DraftStateProvider } from "./context";
import { Loading } from "~/components/loading";
import { Button } from "@shadcn/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export const Connector: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [params] = useSearchParams();
  const userInputCurrencyId = params.get(INPUT_CURRENCY_KEY) as UserCurrencyId;
  const userOutputCurrencyId = params.get(
    OUTPUT_CURRENCY_KEY
  ) as UserCurrencyId;

  return (
    <_Connector key={`${userInputCurrencyId}/${userOutputCurrencyId}`}>
      {children}
    </_Connector>
  );
};

const _Connector: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [, setSearchParams] = useSearchParams();
  const {
    inputCurrency,
    outputCurrency,
    marketPrice,
    isLoading,
    error,
    setMarketPrice,
  } = useConnector();

  const toggleInputOutputCurrencies = () => {
    setSearchParams((prev) => {
      prev.set(
        INPUT_CURRENCY_KEY,
        currencies.getUserCurrencyId(outputCurrency)
      );
      prev.set(
        OUTPUT_CURRENCY_KEY,
        currencies.getUserCurrencyId(inputCurrency)
      );
      return prev;
    });
  };

  const toggleBaseQuoteCurrencies = () => {
    setMarketPrice((prev) => prev.invert());
  };

  // const providerKey = useMemo(() => {
  //   const [currency0, currency1] = currencies.sorted(
  //     inputCurrency,
  //     outputCurrency
  //   );

  //   return `${currency0.wrapped.address}-${currency1.wrapped.address}`;
  // }, [inputCurrency, outputCurrency]);

  return (
    <Mask isLoading={isLoading} error={error}>
      <DraftStateProvider
        inputCurrency={inputCurrency}
        outputCurrency={outputCurrency}
        marketPrice={marketPrice}
        toggleInputOutputCurrencies={toggleInputOutputCurrencies}
        toggleBaseQuoteCurrencies={toggleBaseQuoteCurrencies}
      >
        {children}
      </DraftStateProvider>
    </Mask>
  );
};

const Mask: React.FC<
  React.PropsWithChildren<{ isLoading: boolean; error: Error | null }>
> = ({ children, isLoading, error }) => {
  const enabled = isLoading || !!error;
  console.log("mask: ", { isLoading, error });

  return (
    <div className="relative">
      {children}
      {enabled && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur  rounded-xl flex justify-center items-center">
          {isLoading ? <Loading /> : <SomethingWentWrong />}
        </div>
      )}
    </div>
  );
};

const SomethingWentWrong = () => {
  const [, setSearchParams] = useSearchParams();
  return (
    <div className="flex flex-col items-center justify-center text-sm gap-2">
      <span className=" text-red-600">Something went wrong</span>
      <Button
        size="sm"
        variant="ghost"
        className="text-background h-0 py-3"
        onClick={() => {
          setSearchParams((prev) => {
            prev.delete(INPUT_CURRENCY_KEY);
            prev.delete(OUTPUT_CURRENCY_KEY);
            return prev;
          });
        }}
      >
        <ReloadIcon className="w-4 h-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};
