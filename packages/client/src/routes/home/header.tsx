import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shadcn/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shadcn/components/ui/popover";
import { SettingsIcon } from "~/components/icons/settings";
import { useDraftState } from "./context";
import { Input } from "@shadcn/components/ui/input";
import { numbers } from "~/lib/utils";
import { FeeAmount } from "@uniswap/v3-sdk";
import { cn } from "@shadcn/utils";

export const Header = () => {
  return (
    <div className="w-full flex flex-row justify-end">
      <Popover>
        <PopoverTrigger>
          <SettingsIcon className="h-6 w-6 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <PopoverMenu />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const PopoverMenu = () => {
  return (
    <Accordion type="single" collapsible className="[&>*]:border-b-0">
      <DeadlineControl />
      <PriceEstimatePrecisionControl />
    </Accordion>
  );
};

const DeadlineControl = () => {
  const { transactionDeadline, setTransactionDeadline } = useDraftState();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (numbers.isGTZero(value)) {
      setTransactionDeadline(value);
    }
  };

  return (
    <AccordionItem value="deadline">
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="w-full flex flex-row justify-between mr-2">
          <span className="text-muted-foreground">Transaction deadline</span>
          <span>{transactionDeadline}m</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-row items-center gap-3 border border-input pb-0 px-2 rounded-xl">
        <Input
          className="border-none shadow-none focus-visible:ring-0 p-0 text-end"
          type="string"
          pattern="\d*"
          value={transactionDeadline}
          onChange={onInputChange}
        />
        <span>minutes</span>
      </AccordionContent>
    </AccordionItem>
  );
};

const PRECISION_MAP = {
  [FeeAmount.HIGH]: "LOWEST",
  [FeeAmount.MEDIUM]: "LOW",
  [FeeAmount.LOW]: "MEDIUM",
  [FeeAmount.LOWEST]: "HIGH",
} as const;

const PRECISION_MAP_REVERSE = {
  LOWEST: FeeAmount.HIGH,
  LOW: FeeAmount.MEDIUM,
  MEDIUM: FeeAmount.LOW,
  HIGH: FeeAmount.LOWEST,
} as const;

const PRECISIONS = ["HIGH", "MEDIUM", "LOW", "LOWEST"] as const;

export const PriceEstimatePrecisionControl = () => {
  const { feeAmount, setFeeAmount } = useDraftState();

  const estimatePrecision = PRECISION_MAP[feeAmount];

  return (
    <AccordionItem value="price-estimate-precision">
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="w-full flex flex-row justify-between mr-2">
          <span className="text-muted-foreground">
            Price estimate precision
          </span>
          <span>{estimatePrecision}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-row gap-2">
          {PRECISIONS.map((precision) => (
            <div
              key={precision}
              className={cn(
                "w-16 h-16 rounded-md flex items-center justify-center bg-muted text-xs cursor-pointer",
                precision === estimatePrecision && "bg-primary",
                precision === estimatePrecision && "text-background"
              )}
              onClick={() => setFeeAmount(PRECISION_MAP_REVERSE[precision])}
            >
              {precision}
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
