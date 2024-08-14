import { Button } from "@shadcn/components/ui/button";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { useDraftState } from "./context";
import { useCurrencyAmountOf } from "~/lib/hooks/use-currency-amount-of";
import { useMemo } from "react";
import {
  CurrencyAmount,
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
} from "@uniswap/sdk-core";
import { Address, parseUnits } from "viem";
import { useApproved } from "~/lib/hooks/use-approved";
import { numbers } from "~/lib/utils";
import { useMintPosition } from "~/lib/hooks/use-mint-position";

import { cn } from "@shadcn/utils";

export const Submit = () => {
  const account = useAccount();

  if (!account.isConnected) {
    return <ConnectWalletButton />;
  }

  return <ConfirmButton />;
};

const ConnectWalletButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ show }) => {
        return (
          <Button className="w-full h-12 rounded-2xl bg-primary" onClick={show}>
            Connect Wallet
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

const ConfirmButton = () => {
  const { address, chainId } = useAccount();
  const {
    inputCurrency,
    outputCurrency,
    inputAmount,
    priceBaseOnInput,
    marketPrice,
    feeAmount,
    onInputAmountChange,
  } = useDraftState();

  const inputCurrencyAmount = useMemo(() => {
    return CurrencyAmount.fromRawAmount(
      inputCurrency,
      parseUnits(inputAmount, inputCurrency.decimals).toString()
    );
  }, [inputCurrency, inputAmount]);

  const { data: inputCurrencyBalance } = useCurrencyAmountOf(
    address,
    inputCurrency
  );

  const isInputPositiveAmount = useMemo(
    () => numbers.isGTZero(Number(inputAmount)),
    [inputAmount]
  );
  const isEnoughBalance = useMemo(() => {
    if (!inputCurrencyBalance) {
      return false;
    }

    return (
      inputCurrencyBalance.greaterThan(inputCurrencyAmount) ||
      inputCurrencyBalance.equalTo(inputCurrencyAmount)
    );
  }, [inputCurrencyAmount, inputCurrencyBalance]);

  const { hasApproved, approve } = useApproved(
    address,
    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId!] as Address, // todo
    inputCurrencyAmount
  );

  const { mint, isFetchingPool } = useMintPosition(
    inputCurrency,
    outputCurrency,
    inputAmount,
    feeAmount,
    marketPrice,
    priceBaseOnInput
  );

  const onConfirm = async () => {
    if (!hasApproved) {
      return approve();
    }

    // deadline 12 hours
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 12;
    await mint(deadline);
    onInputAmountChange("");
  };

  const isPreparing = isFetchingPool;
  const isConfirmDisabled =
    isPreparing || !isEnoughBalance || !isInputPositiveAmount;

  const text = useMemo(() => {
    switch (true) {
      case isPreparing:
        return "Loading...";
      case !isEnoughBalance:
        return `Insufficient ${inputCurrency.symbol} Balance`;
      case !hasApproved:
        return `Approve ${inputCurrency.symbol}`;

      case hasApproved:
        return "Confirm";
    }
  }, [isPreparing, isEnoughBalance, hasApproved, inputCurrency.symbol]);

  return (
    <Button
      className={cn(
        "w-full h-12 rounded-2xl bg-primary",
        !isPreparing && !isEnoughBalance && "bg-red-500"
      )}
      disabled={isConfirmDisabled}
      onClick={onConfirm}
    >
      {text}
    </Button>
  );
};
