import { PriceSetter } from "./price-setter";
import { DraftStateProvider } from "./context";
import { AmountSetter } from "./amount-setter";
import { Details } from "./details";
import { Submit } from "./submit";

export const Maker = () => {
  return (
    <DraftStateProvider>
      <div className="w-full max-w-[420px] flex flex-col items-center gap-y-1">
        <PriceSetter />
        <AmountSetter />
        <Submit />
        <Details />
      </div>
    </DraftStateProvider>
  );
};
