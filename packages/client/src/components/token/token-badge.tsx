import { Currency } from "@uniswap/sdk-core";
import { CurrencyAvatar } from "./token-avatar";
import { cn } from "@shadcn/utils";

export const TokenBadge: React.FC<{
  children: Currency;
  avatarSize?: string | number;
  className?: string;
}> = ({ children: currency, avatarSize, className }) => {
  const symbol = currency?.symbol ?? "Unknown";

  return (
    <div
      className={cn(
        "flex flex-row items-center space-x-1 token-badge",
        className
      )}
    >
      <CurrencyAvatar size={avatarSize}>{currency}</CurrencyAvatar>
      <span className="text-primary font-medium">{symbol}</span>
    </div>
  );
};
