import { Button } from "@shadcn/components/ui/button";
import { Card } from "@shadcn/components/ui/card";
import { useState } from "react";
import { DecimalInput } from "~/components/decimal-input";
import { TokenBadge } from "~/components/token/token.badge";
import { useDraftMakerContext } from "./context";
import { ChevronDownIcon, SymbolIcon } from "@radix-ui/react-icons";
import { cn } from "@shadcn/utils";

export const AmountSetter = () => {
  return (
    <div className="w-full flex flex-col items-center gap-y-1 relative">
      <AmountSell />
      <CenterInvert />
      <AmountBuy />
    </div>
  );
};

const AmountSell = () => {
  const {
    marketPrice: { baseCurrency },
  } = useDraftMakerContext();
  const [sellAmount, setSellAmount] = useState<string | null>(null);

  return (
    <Card className="w-full bg-accent flex flex-col p-4 rounded-2xl border-none shadow-none h-[120px] overflow-clip">
      <span className="text-sm text-muted-foreground">Sell</span>
      <div className="flex flex-row mt-1">
        <DecimalInput
          className="border-none shadow-none focus-visible:ring-0 p-0 text-3xl font-normal"
          style={{ height: "2.6rem" }}
          autoComplete="off"
          autoCorrect="off"
          value={sellAmount ?? ""}
          onChange={(e) => setSellAmount(e.target.value)}
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

// const BalanceChecker1 = () => {
//   return (
//     <div className="w-min self-end flex flex-row items-center gap-px h-6">
//       <span className="text-nowrap text-sm leading-none  text-muted-foreground">
//         Balance: 0.049
//       </span>
//       <Button
//         variant="ghost"
//         className="text-rose-500 font-bold px-2 py-none rounded-full h-full"
//       >
//         Max
//       </Button>
//     </div>
//   );
// };

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

const AmountBuy = () => {
  const {
    marketPrice: { quoteCurrency },
  } = useDraftMakerContext();
  const [buyAmount, setBuyAmount] = useState<string | null>(null);

  return (
    <Card className="w-full bg-accent flex flex-col p-4 rounded-2xl border-none shadow-none h-[120px] overflow-clip">
      <span className="text-sm text-muted-foreground">Buy</span>
      <div className="flex flex-row mt-1">
        <DecimalInput
          className="border-none shadow-none focus-visible:ring-0 p-0 text-3xl font-normal"
          style={{ height: "2.6rem" }}
          autoComplete="off"
          autoCorrect="off"
          value={buyAmount ?? ""}
          onChange={(e) => setBuyAmount(e.target.value)}
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
