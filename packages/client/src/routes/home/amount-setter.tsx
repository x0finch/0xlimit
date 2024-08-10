import { Button } from "@shadcn/components/ui/button";
import { Card } from "@shadcn/components/ui/card";
import { useMemo } from "react";
import { DecimalInput } from "~/components/decimal-input";
import { TokenBadge } from "~/components/token/token.badge";
import { useDraftMakerContext } from "./context";
import { ChevronDownIcon, SymbolIcon } from "@radix-ui/react-icons";
import { cn } from "@shadcn/utils";
import { Decimal } from "~/lib/utils";
import { CurrencyAmount } from "@uniswap/sdk-core";

export const AmountSetter = () => {
  return (
    <div className="w-full flex flex-col items-center gap-y-1 relative">
      <AmountInput />
      <CenterInvert />
      <AmountOutput />
    </div>
  );
};

const AmountInput = () => {
  const {
    preferPrice,
    marketPrice,
    inputAmount,
    setInputAmount,
    setOutputAmount,
  } = useDraftMakerContext();
  const price = preferPrice || marketPrice;
  const { baseCurrency } = price;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAmount = e.target.value;
    const outputAmount = price
      .quote(
        CurrencyAmount.fromRawAmount(
          baseCurrency,
          Math.floor(Number(inputAmount) * Math.pow(10, baseCurrency.decimals))
        )
      )
      .toSignificant(6);

    setInputAmount(inputAmount as Decimal);
    setOutputAmount(outputAmount as Decimal);
  };

  return (
    <Card className="w-full bg-accent flex flex-col p-4 rounded-2xl border-none shadow-none h-[120px] overflow-clip">
      <span className="text-sm text-muted-foreground">Sell</span>
      <div className="flex flex-row mt-1">
        <DecimalInput
          className="border-none shadow-none focus-visible:ring-0 p-0 text-3xl font-normal"
          style={{ height: "2.6rem" }}
          autoComplete="off"
          autoCorrect="off"
          value={inputAmount ?? ""}
          onChange={onInputChange}
        />
        <Button variant="outline" className="rounded-full h-8 pl-1 pr-2 py-0">
          <TokenBadge avatarSize="1.5rem" className="text-lg">
            {baseCurrency}
          </TokenBadge>
          <ChevronDownIcon className="ml-1" />
        </Button>
      </div>
      <Balance showMax />
    </Card>
  );
};

const CenterInvert = () => {
  const { invert } = useDraftMakerContext();
  return (
    <Button
      onClick={invert}
      variant="outline"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 p-0 border-4 border-background bg-accent shadow-none rounded-xl"
    >
      <SymbolIcon />
    </Button>
  );
};

const AmountOutput = () => {
  const {
    marketPrice,
    preferPrice,
    outputAmount,
    setOutputAmount,
    setInputAmount,
  } = useDraftMakerContext();

  const price = preferPrice || marketPrice;
  const { quoteCurrency } = price;
  const invertedPrice = useMemo(() => price.invert(), [price]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const outputAmount = e.target.value;
    const inputAmount = invertedPrice
      .quote(
        CurrencyAmount.fromRawAmount(
          quoteCurrency,
          Math.floor(
            Number(outputAmount) * Math.pow(10, quoteCurrency.decimals)
          )
        )
      )
      .toSignificant(6);

    setOutputAmount(outputAmount as Decimal);
    setInputAmount(inputAmount as Decimal);
  };

  return (
    <Card className="w-full bg-accent flex flex-col p-4 rounded-2xl border-none shadow-none h-[120px] overflow-clip">
      <span className="text-sm text-muted-foreground">For</span>
      <div className="flex flex-row mt-1">
        <DecimalInput
          className="border-none shadow-none focus-visible:ring-0 p-0 text-3xl font-normal"
          style={{ height: "2.6rem" }}
          autoComplete="off"
          autoCorrect="off"
          value={outputAmount ?? ""}
          onChange={onInputChange}
        />
        <Button variant="outline" className="rounded-full h-8 pl-1 pr-2 py-0">
          <TokenBadge avatarSize="1.5rem" className="text-lg">
            {quoteCurrency}
          </TokenBadge>
          <ChevronDownIcon className="ml-1" />
        </Button>
      </div>
      <Balance />
    </Card>
  );
};

const Balance: React.FC<{ className?: string; showMax?: boolean }> = ({
  className,
  showMax,
}) => {
  return (
    <div
      className={cn(
        "w-min self-end flex flex-row items-center gap-1 h-6 text-sm leading-none",
        className
      )}
    >
      <span className="text-nowrap text-muted-foreground">Balance: 21</span>
      {showMax && (
        <Button
          variant="ghost"
          className="h-full text-rose-500 font-bold p-0 rounded-full"
        >
          Max
        </Button>
      )}
    </div>
  );
};
