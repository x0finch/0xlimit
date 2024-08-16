import { PriceSetter } from "./price-setter";
import { AmountSetter } from "./amount-setter";
import { Details } from "./details";
import { Submit } from "./submit";
import { Header } from "./header";

export const LimitOrderCreator = () => {
  return (
    <div className="w-full max-w-[420px] flex flex-col items-center gap-y-1">
      <Header />
      <PriceSetter />
      <AmountSetter />
      <Submit />
      <Details />
    </div>
  );
};
