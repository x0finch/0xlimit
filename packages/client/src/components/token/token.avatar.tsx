import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "@shadcn/components/ui/avatar";
import { Token } from "@uniswap/sdk-core";

export const TokenAvatar: React.FC<{
  children: Token | null | undefined;
  size?: number | string;
}> = ({ children: token, size }) => {
  size ??= "1rem"
  const symbol = token?.symbol ?? "Unknown";

  return (
    <Avatar className="token-avatar" style={{ width: size, height: size }}>
      <AvatarImage src="https://github.com/shadcn.png" alt={symbol} />
      <AvatarFallback className="fallback">{symbol}</AvatarFallback>
    </Avatar>
  );
};
