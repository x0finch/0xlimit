export const DECIMAL_PATTERN = /^[0-9]*[.,]?[0-9]*$/;

export const isGTEZero = (value: number) =>
  Number.isFinite(value) && value >= 0;
