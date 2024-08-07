import { Button } from "@shadcn/components/ui/button";
import { Card } from "@shadcn/components/ui/card";
import { TokenBadge } from "~/components/token/token.badge";
import { useDraftMakerContext } from "./context";
import { useEffect, useMemo, useState } from "react";
import { SymbolIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Decimal, numbers, prices } from "~/lib";
import { DecimalInput } from "~/components/decimal-input";
import { CurrencyAmount } from "@uniswap/sdk-core";

export const PriceSetter = () => {
  const {
    marketPrice: { baseCurrency, quoteCurrency },
  } = useDraftMakerContext();
  const baseTokenKey = `${baseCurrency.chainId}_${baseCurrency.address}`;
  const quoteTokenKey = `${quoteCurrency.chainId}_${quoteCurrency.address}`;

  return <InnerPriceSetter key={`${baseTokenKey}/${quoteTokenKey}`} />;
};

const InnerPriceSetter = () => {
  const { marketPrice, setPreferPrice, inputAmount, setOutputAmount } =
    useDraftMakerContext();
  const [isInvert, setIsInvert] = useState(false);
  const [inputPrice, setInputPrice] = useState<string | null>(null);

  const baseToken = isInvert
    ? marketPrice.quoteCurrency
    : marketPrice.baseCurrency;
  const quoteToken = isInvert
    ? marketPrice.baseCurrency
    : marketPrice.quoteCurrency;

  const displayPrice = useMemo(() => {
    if (inputPrice !== null) {
      return inputPrice;
    }

    const price = isInvert ? marketPrice.invert() : marketPrice;
    return price.toSignificant(6);
  }, [marketPrice, inputPrice, isInvert]);

  const priceNumber = useMemo(() => {
    const price = Number(displayPrice);
    if (numbers.isGTEZero(price)) {
      return price;
    }
    return 0;
  }, [displayPrice]);

  const onInvertClick = () => {
    setIsInvert((prev) => !prev);
    setInputPrice(null);
  };

  useEffect(() => {
    let price = prices.from(baseToken, quoteToken, priceNumber);

    if (isInvert) {
      price = price.invert();
    }

    setPreferPrice(price);
    if (inputAmount) {
      const outputAmount = price
        .quote(
          CurrencyAmount.fromRawAmount(
            price.baseCurrency,
            Math.floor(
              Number(inputAmount) * Math.pow(10, price.baseCurrency.decimals)
            )
          )
        )
        .toSignificant(6);
      setOutputAmount(outputAmount as Decimal);
    }
  }, [priceNumber]);

  return (
    <Card className="w-full bg-accent p-4 rounded-2xl border-none shadow-none space-y-1 relative">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>When 1</span>
        <TokenBadge avatarSize="1rem">{baseToken}</TokenBadge>
        <span> is worth</span>
      </div>
      <div className="flex flex-row">
        <DecimalInput
          className="border-none shadow-none focus-visible:ring-0 p-0 text-3xl font-normal"
          style={{ height: "2.6rem" }}
          autoComplete="off"
          autoCorrect="off"
          value={displayPrice}
          onChange={(e) => setInputPrice(e.target.value)}
        />
        <TokenBadge className="text-base" avatarSize="1rem">
          {quoteToken}
        </TokenBadge>
      </div>
      <AdjustPercents
        price={priceNumber}
        isInvert={isInvert}
        setInputPrice={setInputPrice}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-2 rounded-full"
        onClick={onInvertClick}
      >
        <SymbolIcon />
      </Button>
    </Card>
  );
};

const AdjustPercents: React.FC<{
  isInvert: boolean;
  price: number;
  setInputPrice: (price: string | null) => void;
}> = ({ isInvert, price, setInputPrice }) => {
  const { marketPrice } = useDraftMakerContext();
  const baseToken = isInvert
    ? marketPrice.quoteCurrency
    : marketPrice.baseCurrency;

  const percent = useMemo(() => {
    const transformedMarketPrice = marketPrice.baseCurrency.equals(baseToken)
      ? marketPrice
      : marketPrice.invert();

    const marketPriceNumber = Number(transformedMarketPrice.toSignificant(6));
    const draftPercent =
      ((price - marketPriceNumber) / marketPriceNumber) * 100;
    const isPositive = draftPercent > 0;
    return Math.ceil(Math.abs(draftPercent)) * (isPositive ? 1 : -1);
  }, [baseToken, price, marketPrice]);

  const onPercentChange = (percent: number) => {
    if (percent === 0) {
      setInputPrice(null);
      return;
    }

    const transformedMarketPrice = marketPrice.baseCurrency.equals(baseToken)
      ? marketPrice
      : marketPrice.invert();

    const multiplier = 1 + percent / 100;
    const adjustPrice =
      Number(transformedMarketPrice.toSignificant()) * multiplier;

    setInputPrice(
      prices
        .from(
          transformedMarketPrice.baseCurrency,
          transformedMarketPrice.quoteCurrency,
          adjustPrice
        )
        .toSignificant(6)
    );
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
        .map((value) => (isInvert ? -value : value))
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
