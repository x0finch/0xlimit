import { Button } from "@shadcn/components/ui/button";
import { Card } from "@shadcn/components/ui/card";
import { DecimalInput } from "~/components/decimal-input";
import { TokenBadge } from "~/components/token/token.badge";
import { useDraftMakerContext } from "./context";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export const AmountBuy = () => {
  const { marketPrice: { quoteCurrency } } = useDraftMakerContext();
  const [buyAmount, setBuyAmount] = useState<string | null>(null)

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
      <BalanceChecker />
    </Card>
  );
};

const BalanceChecker = () => {
  return (
    <div className="w-min self-end flex flex-row items-center gap-px">
      <span className="text-nowrap text-sm text-muted-foreground">Balance: 21</span>
    </div>
  );
};
