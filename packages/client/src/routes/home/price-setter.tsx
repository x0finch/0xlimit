import { Button } from "@shadcn/components/ui/button";
import { Card } from "@shadcn/components/ui/card";
import { TokenBadge } from "~/components/token/token.badge";
import { useDraftState } from "./context";
import { useMemo } from "react";
import { SymbolIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Decimal, prices } from "~/lib/utils";
import { DecimalInput } from "~/components/decimal-input";

export const PriceSetter = () => {
  const {
    marketPrice: { baseCurrency, quoteCurrency },
  } = useDraftState();
  const baseTokenKey = `${baseCurrency.chainId}_${baseCurrency.wrapped.address}`;
  const quoteTokenKey = `${quoteCurrency.chainId}_${quoteCurrency.wrapped.address}`;

  return <InnerPriceSetter key={`${baseTokenKey}/${quoteTokenKey}`} />;
};

const InnerPriceSetter = () => {
  const {
    marketPrice,
    inputPrice,
    onInputPriceChange,
    toggleBaseQuoteCurrencies,
  } = useDraftState();
  const { baseCurrency, quoteCurrency } = marketPrice;

  return (
    <Card className="w-full bg-accent p-4 rounded-2xl border-none shadow-none space-y-1 relative">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Prefer 1</span>
        <TokenBadge avatarSize="1rem">{baseCurrency}</TokenBadge>
        <span> is worth</span>
      </div>
      <div className="flex flex-row">
        <DecimalInput
          className="border-none shadow-none focus-visible:ring-0 p-0 text-3xl font-normal"
          style={{ height: "2.6rem" }}
          autoComplete="off"
          autoCorrect="off"
          value={inputPrice}
          onChange={onInputPriceChange}
        />
        <TokenBadge className="text-base" avatarSize="1rem">
          {quoteCurrency}
        </TokenBadge>
      </div>
      <AdjustPercents />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-2 rounded-full"
        onClick={toggleBaseQuoteCurrencies}
      >
        <SymbolIcon />
      </Button>
    </Card>
  );
};

const AdjustPercents = () => {
  const {
    marketPrice,
    inputCurrency,
    priceBaseOnInput,
    priceBaseOnOutput,
    onInputPriceChange,
  } = useDraftState();

  const inputCurrencyIsBaseCurrency = inputCurrency.equals(
    marketPrice.baseCurrency
  );

  const preferPrice = inputCurrencyIsBaseCurrency
    ? priceBaseOnInput
    : priceBaseOnOutput;

  const percent = useMemo(() => {
    const percent = prices.percent(marketPrice, preferPrice);
    return Math.round(Number(percent.toSignificant()));
  }, [marketPrice, preferPrice]);

  const onPercentChange = (percent: number) => {
    if (percent === 0) {
      onInputPriceChange(null);
      return;
    }

    const adjustedPrice = prices.adjust(marketPrice, percent);
    onInputPriceChange(adjustedPrice.toSignificant() as Decimal);
  };

  const showPercent = Math.abs(percent) > 10;

  return (
    <div className="flex flex-row space-x-1">
      {!showPercent && (
        <SmallOutlineButton
          isActive={percent === 0}
          onClick={() => onPercentChange(0)}
        >
          Market
        </SmallOutlineButton>
      )}
      {showPercent && (
        <CurrentPercentItem onClick={() => onPercentChange(0)}>
          {percent}
        </CurrentPercentItem>
      )}
      {[1, 5, 10]
        .map((value) => (inputCurrencyIsBaseCurrency ? value : -value))
        .map((value) => (
          <PercentItem
            key={`${value}`}
            onClick={() => onPercentChange(value)}
            isActive={value === percent}
          >
            {value}
          </PercentItem>
        ))}
    </div>
  );
};

const CurrentPercentItem: React.FC<{
  children: number;
  onClick: () => void;
}> = ({ children: percent, onClick }) => {
  const isPositive = percent > 0;

  return (
    <SmallOutlineButton isActive onClick={onClick}>
      {isPositive ? "+" : "-"}
      {Math.abs(percent)}%
      <Cross2Icon className="w-4 h-4 ml-1 mr-[-0.25rem]" />
    </SmallOutlineButton>
  );
};

const PercentItem: React.FC<{
  children: number;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ children: percent, onClick, isActive }) => {
  const isPositive = percent > 0;

  return (
    <SmallOutlineButton onClick={onClick} isActive={isActive}>
      {isPositive ? "+" : "-"}
      {Math.abs(percent)}%
    </SmallOutlineButton>
  );
};

const SmallOutlineButton: React.FC<
  React.PropsWithChildren<{
    isActive?: boolean;
    onClick?: () => void;
  }>
> = ({ children, isActive, onClick }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`rounded-3xl h-7 bg-none ${isActive ? "bg-secondary" : ""}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
