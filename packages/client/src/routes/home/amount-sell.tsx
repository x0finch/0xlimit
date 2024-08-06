import { Button } from "@shadcn/components/ui/button";
import { Card } from "@shadcn/components/ui/card";
import { useState } from "react";
import { DecimalInput } from "~/components/decimal-input";
import { TokenBadge } from "~/components/token/token.badge";
import { useDraftMakerContext } from "./context";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export const AmountSell = () => {
  const { marketPrice: { baseCurrency } } = useDraftMakerContext();
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
      <BalanceChecker />
    </Card>
  );
};

const BalanceChecker = () => {
  return (
    <div className="w-min self-end flex flex-row items-center gap-px h-6">
      <span className="text-nowrap text-sm leading-none  text-muted-foreground">Balance: 0.049</span>
      <Button variant="ghost" className="text-rose-500 font-bold px-2 py-none rounded-full h-full">
        Max
      </Button>
    </div>
  );
};
