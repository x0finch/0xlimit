import { PriceInput } from "./price-input";
import { DraftMakerProvider } from "./context";
import { AmountSell } from "./amount-sell";
import { AmountBuy } from "./amount-buy";
import { CenterInvert } from "./center-invert";

export const Maker = () => {
  return (
    <DraftMakerProvider>
      <div className="w-full max-w-[450px] flex flex-col items-center gap-y-1">
        <PriceInput />
        <div className="w-full flex flex-col items-center gap-y-1 relative">
          <AmountSell />
          <CenterInvert />
          <AmountBuy />
        </div>
      </div>
    </DraftMakerProvider>
  );
};
