import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shadcn/components/ui/accordion";
import { useDraftMakerContext } from "./context";
import { useMemo } from "react";
import { calculateMaxOutput, calculateTickerRange } from "./helper";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { prices } from "~/lib";
import { tickToPrice } from "@uniswap/v3-sdk";

export const Details = () => {
  const { marketPrice, preferPrice, feeAmount, inputAmount } =
    useDraftMakerContext();
  const { baseCurrency, quoteCurrency } = marketPrice;

  const { minTicker, maxTicker } = useMemo(
    () => calculateTickerRange(feeAmount, marketPrice, preferPrice),
    [marketPrice, preferPrice, feeAmount]
  );
  const [minPrice, maxPrice] = useMemo(() => {
    const sorted = baseCurrency.sortsBefore(quoteCurrency);
    const results = [
      tickToPrice(baseCurrency, quoteCurrency, minTicker),
      tickToPrice(baseCurrency, quoteCurrency, maxTicker),
    ];
    return sorted ? results : results.reverse();
  }, [minTicker, maxTicker]);

  const maxOutput = useMemo(() => {
    return calculateMaxOutput(
      CurrencyAmount.fromRawAmount(
        baseCurrency,
        Number(inputAmount) * Math.pow(10, baseCurrency.decimals)
      ),
      quoteCurrency,
      minTicker,
      maxTicker
    ).toSignificant(6);
  }, [baseCurrency, quoteCurrency, minTicker, maxTicker, inputAmount]);

  const avgPrice = useMemo(() => {
    const fakeInputAmount = 1;
    const fakeMaxOutput = calculateMaxOutput(
      CurrencyAmount.fromRawAmount(
        baseCurrency,
        fakeInputAmount * Math.pow(10, baseCurrency.decimals)
      ),
      quoteCurrency,
      minTicker,
      maxTicker
    ).toSignificant(6);

    return prices.from(
      baseCurrency,
      quoteCurrency,
      Number(fakeMaxOutput) / fakeInputAmount
    );
  }, [baseCurrency, quoteCurrency, minTicker, maxTicker]);

  return (
    <Accordion type="single" collapsible className="w-full px-2">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="hover:no-underline py-3">
          {!avgPrice && "-"}
          {avgPrice &&
            `Avg. 1 ${avgPrice.baseCurrency.symbol} = ${avgPrice.toSignificant(
              6
            )} ${avgPrice.quoteCurrency.symbol}`}
        </AccordionTrigger>
        <AccordionContent>
          <ContentRow label="Max Output" value={maxOutput} />
          <ContentRow
            label="Min Price"
            value={`${minPrice.toSignificant(6)}`}
          />
          <ContentRow
            label="Max Price"
            value={`${maxPrice.toSignificant(6)}`}
          />
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
