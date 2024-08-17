import { useSearchParams } from "react-router-dom";
import {
  FlattedToken,
  SelectTokenDialog,
} from "~/components/select-token-dialog";
import { INPUT_CURRENCY_KEY, OUTPUT_CURRENCY_KEY } from "./helper";
import { UserCurrencyId } from "~/lib/types";
import { useMemo } from "react";
import { NATIVE_TOKEN_INFO } from "~/lib/constants";

export const ConnectedSelectTokenDialog: React.FC<
  React.PropsWithChildren<{
    onSelect: (token: FlattedToken) => void;
  }>
> = ({ children, onSelect }) => {
  const [params] = useSearchParams();
  const userInputCurrencyId = params.get(INPUT_CURRENCY_KEY) as UserCurrencyId;
  const userOutputCurrencyId = params.get(
    OUTPUT_CURRENCY_KEY
  ) as UserCurrencyId;
  const selectedAddresses = useMemo(() => {
    return [userInputCurrencyId, userOutputCurrencyId].map((id) =>
      (id === NATIVE_TOKEN_INFO.symbol
        ? NATIVE_TOKEN_INFO.address
        : id
      ).toLowerCase()
    );
  }, [userInputCurrencyId, userOutputCurrencyId]);

  return (
    <SelectTokenDialog
      onSelect={onSelect}
      selectedAddresses={selectedAddresses}
    >
      {children}
    </SelectTokenDialog>
  );
};
