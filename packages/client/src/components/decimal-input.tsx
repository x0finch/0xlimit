import { Input, InputProps } from "@shadcn/components/ui/input";
import { Decimal, numbers } from "~/lib/utils";

export type DecimalInputProps = Omit<
  InputProps,
  "type" | "pattern" | "inputMode" | "onChange"
> & {
  onChange: (e: Decimal) => void;
};

export const DecimalInput: React.FC<DecimalInputProps> = ({
  placeholder = "0",
  minLength = 1,
  maxLength = 80,
  autoComplete = "off",
  autoCorrect = "off",
  onChange,
  ...props
}) => {
  const onChangeWrapped = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (numbers.DECIMAL_PATTERN.test(e.target.value)) {
      onChange?.(e.target.value as Decimal);
    }
  };

  return (
    <Input
      type="text"
      inputMode="decimal"
      pattern={`${numbers.DECIMAL_PATTERN}`}
      minLength={minLength}
      maxLength={maxLength}
      placeholder={placeholder}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      onChange={onChangeWrapped}
      {...props}
    />
  );
};
