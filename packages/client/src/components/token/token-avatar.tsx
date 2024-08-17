import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "@shadcn/components/ui/avatar";
import { Currency } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { useTokenList } from "~/lib/hooks/use-token-list";

const ETH_DEFAULT_LOGO_URI =
  "https://assets.coingecko.com/coins/images/279/small/ethereum.png";

const CGK_LOGO_HOST = "https://assets.coingecko.com/";

const transformCGKLogoToSmall = (logoURI?: string) => {
  const isCGKLogo = logoURI?.startsWith(CGK_LOGO_HOST);

  if (!isCGKLogo) {
    return logoURI;
  }

  return logoURI!.replace("/thumb/", "/small/");
};

export const TokenAvatar: React.FC<{
  children: Currency;
  size?: number | string;
}> = ({ children: currency, size }) => {
  size ??= "1rem";
  const symbol = currency.symbol ?? "Token";

  const { tokenList } = useTokenList(currency.chainId ?? 0);
  const logoURI = useMemo(() => {
    if (currency.isNative) {
      return ETH_DEFAULT_LOGO_URI;
    }

    const lowerCaseAddress = currency.address.toLowerCase();
    return transformCGKLogoToSmall(
      tokenList?.find((token) => token.address === lowerCaseAddress)?.logoURI
    );
  }, [tokenList, currency]);

  return (
    <Avatar className="token-avatar" style={{ width: size, height: size }}>
      <AvatarImage src={logoURI} alt={symbol} />
      <AvatarFallback className="fallback w-full flex items-center justify-center">
        {symbol.slice(0, 1)}
      </AvatarFallback>
    </Avatar>
  );
};
