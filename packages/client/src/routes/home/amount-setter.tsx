import { Button } from "@shadcn/components/ui/button";
import { Card } from "@shadcn/components/ui/card";
import { DecimalInput } from "~/components/decimal-input";
import { TokenBadge } from "~/components/token/token-badge";
import { useDraftState } from "./context";
import { ChevronDownIcon, SymbolIcon } from "@radix-ui/react-icons";
import { cn } from "@shadcn/utils";
import { Decimal } from "~/lib/utils";
import { Currency } from "@uniswap/sdk-core";
import { useCurrencyAmountOf } from "~/lib/hooks/use-currency-amount-of";
import { useAccount } from "wagmi";
import { SelectTokenDialog } from "~/components/select-token-dialog";
import { ConnectedSelectTokenDialog } from "./connected-select-token-dialog";
import { useSearchParams } from "react-router-dom";
import { NATIVE_TOKEN_INFO } from "~/lib/constants";
import { INPUT_CURRENCY_KEY, OUTPUT_CURRENCY_KEY } from "./helper";

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
  const { inputCurrency, inputAmount, onInputAmountChange } = useDraftState();
  const [, setSearchParams] = useSearchParams();

  return (
    <Card className="w-full bg-accent flex flex-col p-4 rounded-2xl border-none shadow-none h-[120px] overflow-clip">
      <span className="text-sm text-muted-foreground">Sell</span>
      <div className="flex flex-row mt-1">
        <DecimalInput
          className="border-none shadow-none focus-visible:ring-0 p-0 text-3xl font-normal"
          style={{ height: "2.6rem" }}
          autoComplete="off"
          autoCorrect="off"
          value={inputAmount}
          onChange={onInputAmountChange}
        />
        <ConnectedSelectTokenDialog
          onSelect={({ address }) => {
            const isNative = address === NATIVE_TOKEN_INFO.address;

            setSearchParams((prev) => {
              prev.set(
                INPUT_CURRENCY_KEY,
                isNative ? NATIVE_TOKEN_INFO.symbol : address
              );
              return prev;
            });
          }}
        >
          <Button variant="outline" className="rounded-full h-8 pl-1 pr-2 py-0">
            <TokenBadge avatarSize="1.5rem" className="text-lg">
              {inputCurrency}
            </TokenBadge>
            <ChevronDownIcon className="ml-1" />
          </Button>
        </ConnectedSelectTokenDialog>
      </div>
      <Balance showMax onAmountChange={onInputAmountChange}>
        {inputCurrency}
      </Balance>
    </Card>
  );
};

const CenterInvert = () => {
  const { toggleInputOutputCurrencies } = useDraftState();
  return (
    <Button
      onClick={toggleInputOutputCurrencies}
      variant="outline"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 p-0 border-4 border-background bg-accent shadow-none rounded-xl"
    >
      <SymbolIcon />
    </Button>
  );
};

const AmountOutput = () => {
  const [, setSearchParams] = useSearchParams();
  const { outputCurrency, outputAmount, onOutputAmountChange } =
    useDraftState();

  return (
    <Card className="w-full bg-accent flex flex-col p-4 rounded-2xl border-none shadow-none h-[120px] overflow-clip">
      <span className="text-sm text-muted-foreground">For</span>
      <div className="flex flex-row mt-1">
        <DecimalInput
          className="border-none shadow-none focus-visible:ring-0 p-0 text-3xl font-normal"
          style={{ height: "2.6rem" }}
          autoComplete="off"
          autoCorrect="off"
          value={outputAmount}
          onChange={onOutputAmountChange}
        />
        <ConnectedSelectTokenDialog
          onSelect={({ address }) => {
            const isNative = address === NATIVE_TOKEN_INFO.address;

            setSearchParams((prev) => {
              prev.set(
                OUTPUT_CURRENCY_KEY,
                isNative ? NATIVE_TOKEN_INFO.symbol : address
              );
              return prev;
            });
          }}
        >
          <Button variant="outline" className="rounded-full h-8 pl-1 pr-2 py-0">
            <TokenBadge avatarSize="1.5rem" className="text-lg">
              {outputCurrency}
            </TokenBadge>
            <ChevronDownIcon className="ml-1" />
          </Button>
        </ConnectedSelectTokenDialog>
      </div>
      <Balance>{outputCurrency}</Balance>
    </Card>
  );
};

const Balance: React.FC<{
  children: Currency;
  className?: string;
  showMax?: boolean;
  onAmountChange?: (amount: Decimal) => void;
}> = ({ className, showMax, children: currency, onAmountChange }) => {
  const { address } = useAccount();
  const { data } = useCurrencyAmountOf(address, currency);

  return (
    <div
      className={cn(
        "w-min self-end flex flex-row items-center gap-1 h-6 text-sm leading-none",
        className
      )}
    >
      <span className="text-nowrap text-muted-foreground">
        Balance: {data?.toSignificant(3) ?? "--"}
      </span>
      {showMax && (
        <Button
          variant="ghost"
          className="h-full text-rose-500 font-bold p-0 rounded-full"
          disabled={!data}
          onClick={() => data && onAmountChange?.(data.toExact() as Decimal)}
        >
          Max
        </Button>
      )}
    </div>
  );
};
