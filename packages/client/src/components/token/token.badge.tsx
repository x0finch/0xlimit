import { Token } from "@uniswap/sdk-core";
import { TokenAvatar } from "./token.avatar";
import { cn } from "@shadcn/utils";

export const TokenBadge: React.FC<{
  children: Token | null | undefined;
  avatarSize?: string | number;
  className?: string;
}> = ({ children: token, avatarSize, className }) => {
  const symbol = token?.symbol ?? "Unknown";

  return (
    <div
      className={cn(
        "flex flex-row items-center space-x-1 token-badge",
        className
      )}
    >
      <TokenAvatar size={avatarSize}>{token}</TokenAvatar>
      <span className="text-primary font-medium">{symbol}</span>
    </div>
  );
};
