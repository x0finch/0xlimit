import { useStorage } from "./use-storage";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { TOKEN_LIST_MAPPING } from "../constants";

type TokenList = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}[];

const EMPTY_TOKEN_LIST: TokenList = [];

export const useTokenList = (chainId: number) => {
  const url = TOKEN_LIST_MAPPING[chainId];
  const isUrlValid = Boolean(url);

  const [cachedTokenList, setCachedTokenList] = useStorage<TokenList>(
    `TOKEN_LIST.${chainId}`,
    EMPTY_TOKEN_LIST
  );
  const [cachedLastModified, setCachedLastModified] = useStorage<number>(
    `TOKEN_LIST_LAST_MODIFIED.${chainId}`,
    0
  );

  const { data: lastModifiedOnline, isLoading: isLoadingLastModifiedOnline } =
    useQuery({
      queryKey: ["tokenList", "lastModifiedOnline", url],
      queryFn: () =>
        fetch(url, { method: "HEAD" }).then((res) => {
          const lastModified = res.headers.get("last-modified");
          return lastModified ? new Date(lastModified).getTime() : null;
        }),
      enabled: isUrlValid,
    });

  const isTokenListOutdated =
    !cachedTokenList?.length ||
    !cachedLastModified ||
    Number(lastModifiedOnline) > cachedLastModified;

  const { data: tokenListOnline, isLoading: isLoadingTokenListOnline } =
    useQuery<{ tokens: TokenList }>({
      queryKey: ["tokenList", url],
      queryFn: () => fetch(url).then((res) => res.json()),
      enabled: isUrlValid && isTokenListOutdated,
    });

  useEffect(() => {
    if (!tokenListOnline || !lastModifiedOnline) {
      return;
    }

    setCachedLastModified(lastModifiedOnline);
    setCachedTokenList(tokenListOnline.tokens);
  }, [tokenListOnline]);

  const tokenList = cachedTokenList;
  const lastModified = cachedLastModified;
  const isLoading = isLoadingLastModifiedOnline || isLoadingTokenListOnline;

  return {
    tokenList,
    lastModified,
    isLoading,
  };
};
