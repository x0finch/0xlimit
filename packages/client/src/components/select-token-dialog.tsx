import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shadcn/components/ui/dialog";
import { Input } from "@shadcn/components/ui/input";
import React, { useMemo, useState } from "react";
import { PureCurrencyAvatar } from "./token/token-avatar";
import { useChainId } from "wagmi";
import { cn } from "@shadcn/utils";
import { FixedSizeList } from "react-window";
import { IFuseOptions } from "fuse.js";
import { useTokenInfoList } from "../lib/hooks/use-token-info-list";
import { useDebounce } from "~/lib/hooks/use-debounce";
import { useSearch } from "~/lib/hooks/use-search";

export type FlattedToken = {
  address: string;
  name: string;
  symbol: string;
  logoURI?: string;
  amount?: string;
};

type Props = React.PropsWithChildren<{
  onSelect: (token: FlattedToken) => void;
  selectedAddresses?: string[];
  overrideTokens?: FlattedToken[];
}>;

export const SelectTokenDialog: React.FC<Props> = ({ children, ...props }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="mx-auto w-full max-w-sm px-0">
        <DialogHeader className="px-4">
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>
        <Body {...props} />
      </DialogContent>
    </Dialog>
  );
};

const FUSE_OPTIONS: IFuseOptions<FlattedToken> = {
  keys: ["symbol", "name", "address"],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  shouldSort: false,
  findAllMatches: true,
};

const Body: React.FC<Omit<Props, "children">> = ({
  onSelect,
  selectedAddresses,
  overrideTokens,
}) => {
  const chainId = useChainId();
  const { tokenInfoList } = useTokenInfoList(chainId);
  const transformedTokens: FlattedToken[] = useMemo(() => {
    const mapping = Object.fromEntries(
      overrideTokens?.map((token) => [token.address, token]) ?? []
    );

    return tokenInfoList.map((token) => {
      const override = mapping[token.address];
      return {
        ...token,
        ...override,
      };
    });
  }, [tokenInfoList, overrideTokens]);

  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 300);
  const searchResults = useSearch(
    debouncedInput,
    transformedTokens,
    FUSE_OPTIONS
  );
  const displayTokens = useMemo(() => {
    if (!debouncedInput) {
      return transformedTokens;
    }

    return searchResults.map((result) => result.item);
  }, [debouncedInput, transformedTokens, searchResults]);

  return (
    <div className="w-full flex flex-col gap-2 h-96">
      <div className="px-4">
        <Input
          placeholder="Search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <FixedSizeList
        height={500}
        width="100%"
        itemSize={54}
        itemCount={displayTokens.length}
      >
        {({ index, style }) => {
          const token = displayTokens[index];
          const selected = selectedAddresses?.includes(token.address) ?? false;

          return (
            <TokenItem
              key={token.address}
              token={token}
              style={style}
              selected={selected}
              onClick={() => onSelect(token)}
            />
          );
        }}
      </FixedSizeList>
    </div>
  );
};

const TokenItem: React.FC<{
  token: FlattedToken;
  selected?: boolean;
  style: React.CSSProperties;
  onClick?: () => void;
}> = ({ token, selected, style, onClick }) => {
  const { symbol, name, logoURI, amount } = token;

  return (
    <li
      onClick={onClick}
      className={cn(
        "flex flex-row items-center gap-2 px-4 py-2",
        !selected && "cursor-pointer hover:bg-muted/50",
        selected && "opacity-50"
      )}
      style={style}
    >
      <PureCurrencyAvatar size="2.25rem" symbol={symbol} logoURI={logoURI} />
      <div className="flex flex-col">
        <span className="font-medium leading-5">{symbol}</span>
        <span className="text-xs text-muted-foreground">{name}</span>
      </div>
      {amount && <span className="text-sm ml-auto">{amount}</span>}
    </li>
  );
};
