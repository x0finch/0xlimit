export type Decimal = `${number}` | "";

export const DECIMAL_PATTERN = /^[0-9]*[.,]?[0-9]*$/;

export const isGTZero = (value: number) => Number.isFinite(value) && value > 0;

export const isGTEZero = (value: number) => value === 0 || isGTZero(value);
