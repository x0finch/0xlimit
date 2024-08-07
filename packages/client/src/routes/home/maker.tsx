import { PriceSetter } from "./price-setter";
import { DraftMakerProvider } from "./context";
import { AmountSetter } from "./amount-setter";

export const Maker = () => {
  return (
    <DraftMakerProvider>
      <div className="w-full max-w-[450px] flex flex-col items-center gap-y-1">
        <PriceSetter />
        <AmountSetter />
      </div>
    </DraftMakerProvider>
  );
};
