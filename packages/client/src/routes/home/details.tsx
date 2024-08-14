import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shadcn/components/ui/accordion";
import { useDraftState } from "./context";
import { useMemo } from "react";
import { useEstimateAvgPrice, usePriceRange } from "./helper";
import { useTickRange } from "~/lib/hooks/use-tick-range";
import { useMaxOutput } from "~/lib/hooks/use-max-output";

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

  const [tickLower, tickUpper] = useTickRange(
    marketPrice,
    priceBaseOnInput,
    feeAmount
  );
  const [priceLower, priceUpper] = usePriceRange(
    baseCurrency,
    quoteCurrency,
    tickLower,
    tickUpper
  );

  const maxOutput = useMaxOutput(
    inputAmount,
    inputCurrency,
    outputCurrency,
    tickLower,
    tickUpper
  );

  const avgPrice = useEstimateAvgPrice(
    "1", // use 1 as input amount to estimate
    inputCurrency,
    outputCurrency,
    tickLower,
    tickUpper
  );
  const rebaseAvgPrice = useMemo(() => {
    return avgPrice.baseCurrency.equals(baseCurrency)
      ? avgPrice
      : avgPrice.invert();
  }, [avgPrice, baseCurrency]);

  return (
    <Accordion type="single" collapsible className="w-full px-2">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="hover:no-underline py-3">
          {`Avg 1 ${baseCurrency.symbol} = ${rebaseAvgPrice.toSignificant(6)} ${
            quoteCurrency.symbol
          }`}
        </AccordionTrigger>
        <AccordionContent>
          <ContentRow label="Max Output" value={maxOutput.toSignificant()} />
          <ContentRow
            label="Min Price"
            value={`${priceLower.toSignificant()} ${quoteCurrency.symbol}`}
          />
          <ContentRow
            label="Max Price"
            value={`${priceUpper.toSignificant()} ${quoteCurrency.symbol}`}
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
