import JSBI from "jsbi";

export const JSBI_ZERO = JSBI.BigInt(0);

export type Decimal = `${number}` | "";

export const DECIMAL_PATTERN = /^[0-9]*[.,]?[0-9]*$/;

const isNumberGTZero = (value: number) => Number.isFinite(value) && value > 0;
const isNumberGTEZero = (value: number) => value === 0 || isNumberGTZero(value);
const isJSBIGTZero = (value: JSBI) => JSBI.greaterThan(value, JSBI_ZERO);
const isJSBIGTEZero = (value: JSBI) =>
  JSBI.greaterThanOrEqual(value, JSBI_ZERO);

export const isGTZero = (value: number | JSBI) =>
  typeof value === "number" ? isNumberGTZero(value) : isJSBIGTZero(value);

export const isGTEZero = (value: number | JSBI) =>
  typeof value === "number" ? isNumberGTEZero(value) : isJSBIGTEZero(value);
