import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "@shadcn/components/ui/avatar";
import { Currency } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { useTokenInfoList } from "../../lib/hooks/use-token-info-list";
import { NATIVE_TOKEN_INFO } from "~/lib/constants";

const CGK_LOGO_HOST = "https://assets.coingecko.com/";

const transformCGKLogoToSmall = (logoURI?: string) => {
  const isCGKLogo = logoURI?.startsWith(CGK_LOGO_HOST);

  if (!isCGKLogo) {
    return logoURI;
  }

  return logoURI!.replace("/thumb/", "/small/");
};

export const CurrencyAvatar: React.FC<{
  children: Currency;
  size?: number | string;
}> = ({ children: currency, size }) => {
  size ??= "1rem";
  const symbol = currency.symbol ?? "Token";

  const { tokenInfoList } = useTokenInfoList(currency.chainId ?? 0);
  const logoURI = useMemo(() => {
    const address = (
      currency.isNative ? NATIVE_TOKEN_INFO.address : currency.address
    ).toLowerCase();

    return transformCGKLogoToSmall(
      tokenInfoList?.find((token) => token.address === address)?.logoURI
    );
  }, [tokenInfoList, currency]);

  return <PureCurrencyAvatar size={size} logoURI={logoURI} symbol={symbol} />;
};

export const PureCurrencyAvatar: React.FC<{
  size?: number | string;
  logoURI?: string;
  symbol?: string;
}> = ({ size, logoURI, symbol }) => {
  return (
    <Avatar className="token-avatar" style={{ width: size, height: size }}>
      <AvatarImage src={logoURI} alt={symbol} />
      <AvatarFallback className="fallback w-full flex items-center justify-center">
        {symbol?.slice(0, 1) ?? "T"}
      </AvatarFallback>
    </Avatar>
  );
};
