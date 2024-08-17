import { useStorage } from "./use-storage";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { NATIVE_TOKEN_INFO, TOKEN_INFO_LIST_MAPPING } from "../constants";
import { numbers } from "../utils";

export type TokenInfoList = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}[];

const EMPTY_TOKEN_INFO_LIST: TokenInfoList = [];

export const useTokenInfoList = (chainId: number) => {
  const url = TOKEN_INFO_LIST_MAPPING[chainId];
  const isUrlValid = Boolean(url);

  const [cachedList, setCachedList] = useStorage<TokenInfoList>(
    `TOKEN_INFO_LIST.${chainId}`,
    EMPTY_TOKEN_INFO_LIST
  );
  const [cachedLastModified, setCachedLastModified] = useStorage<number>(
    `TOKEN_INFO_LIST_LAST_MODIFIED.${chainId}`,
    0
  );

  const { data: lastModifiedOnline, isLoading: isLoadingLastModifiedOnline } =
    useQuery({
      queryKey: ["tokenInfoList", "lastModifiedOnline", url],
      queryFn: () =>
        fetch(url, { method: "HEAD" }).then((res) => {
          const lastModified = res.headers.get("last-modified");
          return lastModified ? new Date(lastModified).getTime() : null;
        }),
      enabled: isUrlValid,
    });

  const isTokenListOutdated =
    !cachedList?.length ||
    !cachedLastModified ||
    Number(lastModifiedOnline) > cachedLastModified;

  const { data: onlineList, isLoading: isLoadingOnlineList } = useQuery<{
    tokens: TokenInfoList;
  }>({
    queryKey: ["tokenInfoList", url],
    queryFn: () => fetch(url).then((res) => res.json()),
    enabled: isUrlValid && isTokenListOutdated,
  });

  useEffect(() => {
    if (!onlineList || !lastModifiedOnline) {
      return;
    }

    setCachedLastModified(lastModifiedOnline);
    setCachedList(transformTokenInfos(chainId, onlineList.tokens));
  }, [onlineList]);

  const tokenInfoList = cachedList;
  const lastModified = cachedLastModified;
  const isLoading = isLoadingLastModifiedOnline || isLoadingOnlineList;

  return {
    tokenInfoList,
    lastModified,
    isLoading,
  };
};

const transformTokenInfos = (chainId: number, tokenInfos: TokenInfoList) => {
  tokenInfos = tokenInfos
    .filter(
      (token) =>
        token.chainId === chainId &&
        token.symbol &&
        token.name &&
        token.logoURI &&
        numbers.isGTEZero(token.decimals)
    )
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  return [{ chainId, ...NATIVE_TOKEN_INFO }, ...tokenInfos];
};
