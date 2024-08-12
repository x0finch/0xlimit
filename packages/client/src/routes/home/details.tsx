import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shadcn/components/ui/accordion";
import { useDraftState } from "./context";
import { useMemo } from "react";
import { calculateMaxOutput, calculateTickerRange } from "./helper";
import { prices } from "~/lib/utils";
import { tickToPrice } from "@uniswap/v3-sdk";

export const Details = () => {
  const {
    marketPrice,
    priceBaseOnInput,
    inputCurrency,
    outputCurrency,
    feeAmount,
    inputAmount,
  } = useDraftState();

  const { baseCurrency, quoteCurrency } = marketPrice;
  const inputCurrencyIsBaseCurrency = inputCurrency.equals(baseCurrency);

  const marketPriceBaseOnInput = useMemo(() => {
    return inputCurrencyIsBaseCurrency ? marketPrice : marketPrice.invert();
  }, [inputCurrencyIsBaseCurrency, marketPrice]);

  const { minTicker, maxTicker } = useMemo(
    () =>
      calculateTickerRange(feeAmount, marketPriceBaseOnInput, priceBaseOnInput),
    [marketPriceBaseOnInput, priceBaseOnInput, feeAmount]
  );
  const [minPrice, maxPrice] = useMemo(() => {
    const sorted = baseCurrency.wrapped.sortsBefore(quoteCurrency.wrapped);
    const results = [
      tickToPrice(baseCurrency.wrapped, quoteCurrency.wrapped, minTicker),
      tickToPrice(baseCurrency.wrapped, quoteCurrency.wrapped, maxTicker),
    ];
    return sorted ? results : results.reverse();
  }, [minTicker, maxTicker, baseCurrency, quoteCurrency]);

  const maxOutput = useMemo(() => {
    return calculateMaxOutput(
      inputAmount,
      inputCurrency,
      outputCurrency,
      minTicker,
      maxTicker
    ).toSignificant();
  }, [inputCurrency, outputCurrency, minTicker, maxTicker, inputAmount]);

  const avgPrice = useMemo(() => {
    const fakeInputAmount = "1";
    const fakeMaxOutput = calculateMaxOutput(
      fakeInputAmount,
      baseCurrency,
      quoteCurrency,
      minTicker,
      maxTicker
    ).toSignificant();

    return prices.from(
      baseCurrency,
      quoteCurrency,
      Number(fakeMaxOutput) / Number(fakeInputAmount)
    );
  }, [baseCurrency, quoteCurrency, minTicker, maxTicker]);

  return (
    <Accordion type="single" collapsible className="w-full px-2">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="hover:no-underline py-3">
          {!avgPrice && "-"}
          {avgPrice &&
            `Avg. 1 ${baseCurrency.symbol} = ${avgPrice.toSignificant()} ${
              quoteCurrency.symbol
            }`}
        </AccordionTrigger>
        <AccordionContent>
          <ContentRow label="Max Output" value={maxOutput} />
          <ContentRow label="Min Price" value={`${minPrice.toSignificant()}`} />
          <ContentRow label="Max Price" value={`${maxPrice.toSignificant()}`} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const ContentRow: React.FC<{
  label: React.ReactNode;
  value: React.ReactNode;
}> = ({ label, value }) => {
  return (
    <div className="w-full h-5 flex flex-row justify-between text-xs">
      <div className=" text-muted-foreground">{label}</div>
      <div className="">{value}</div>
    </div>
  );
};
