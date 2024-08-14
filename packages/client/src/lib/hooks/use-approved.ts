import { useReadContract, useWriteContract } from "wagmi";
import { CurrencyAmount } from "../alternatives";
import { Address, erc20Abi } from "viem";
import { useCallback, useMemo } from "react";
import { BigintIsh, MaxUint256 } from "@uniswap/sdk-core";

export const useApproved = (
  address: Address | undefined,
  spender: Address,
  amount: CurrencyAmount
) => {
  const { currency } = amount;

  const { writeContractAsync } = useWriteContract();
  const { data: allowance, ...rest } = useReadContract({
    address: currency.wrapped.address as Address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, spender],
    query: { enabled: currency.isToken },
  });

  const allowanceAmount = useMemo(() => {
    if (!allowance) {
      return null;
    }

    return CurrencyAmount.fromRawAmount(currency, allowance.toString());
  }, [currency, allowance]);

  const hasApproved = useMemo(() => {
    if (currency.isNative) {
      return true;
    } else if (!allowanceAmount) {
      return false;
    }

    return (
      allowanceAmount.greaterThan(amount) || allowanceAmount.equalTo(amount)
    );
  }, [allowanceAmount, amount]);

  const approve = useCallback(
    (approvalAmount?: BigintIsh | "max") => {
      if (amount.currency.isNative) {
        throw new Error("Native currency isn't need to approved");
      } else if (typeof approvalAmount === "undefined") {
        approvalAmount = amount.quotient;
      } else if (approvalAmount === "max") {
        approvalAmount = MaxUint256;
      }

      return writeContractAsync({
        address: currency.wrapped.address as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, BigInt(approvalAmount.toString())],
      });
    },
    [address, spender, amount]
  );

  return {
    allowanceAmount,
    hasApproved,
    approve,
    ...rest,
  };
};
