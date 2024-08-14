import { Token } from "@uniswap/sdk-core";
import { prices } from "~/lib/utils";
import { FeeAmount, TICK_SPACINGS, tickToPrice } from "@uniswap/v3-sdk";
import { calculateTickRange } from "./use-tick-range";

const token1 = new Token(
  1,
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  18,
  "ETH"
);
const token0 = new Token(
  1,
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  6,
  "USDC"
);

const ALL_FEE_AMOUNTS = Object.keys(TICK_SPACINGS) as unknown as FeeAmount[];

describe.only("calculateTickRange", () => {
  describe("when inputToken is token1 and outputToken is token0", () => {
    ALL_FEE_AMOUNTS.forEach((feeAmount) => {
      describe(`should return correct tick range on feeAmount ${feeAmount}`, () => {
        const cases = new Array(3)
          .fill(0)
          .map((_, i) => 1 + 1.001 * i)
          .map((ratio) => ({
            inputToken: token1,
            outputToken: token0,
            marketPrice: 2000,
            preferPrice: 2000 * ratio,
          }));

        cases.forEach((testCase) => {
          it(`marketPrice: ${testCase.marketPrice} and preferPrice: ${testCase.preferPrice}`, () => {
            const marketPrice = prices.from(
              testCase.inputToken,
              testCase.outputToken,
              testCase.marketPrice
            );
            const preferPrice = prices.from(
              testCase.inputToken,
              testCase.outputToken,
              testCase.preferPrice
            );
            const marketTick = prices.toTick(marketPrice);
            const preferTick = prices.toTick(preferPrice);

            const [tickLower, tickUpper] = calculateTickRange(
              marketPrice,
              preferPrice,
              feeAmount
            );
            const minPrice = tickToPrice(
              testCase.inputToken,
              testCase.outputToken,
              tickUpper
            ); // tickUpper -> minPrice
            const maxPrice = tickToPrice(
              testCase.inputToken,
              testCase.outputToken,
              tickLower
            ); // tickLower -> maxPrice

            // tickLower and tickUpper both be less than marketTick
            expect(tickLower).toBeLessThan(marketTick);
            expect(tickUpper).toBeLessThan(marketTick);

            expect(tickLower).toBeLessThan(preferTick);
            expect(tickLower).toBeLessThan(tickUpper);

            expect(maxPrice.greaterThan(marketPrice)).toBeTruthy();
            expect(maxPrice.greaterThan(preferPrice)).toBeTruthy();
            expect(maxPrice.greaterThan(minPrice)).toBeTruthy();
            expect(minPrice.greaterThan(marketPrice)).toBeTruthy();
          });
        });
      });
    });
  });

  describe("when inputToken is token0 and outputToken is token1", () => {
    ALL_FEE_AMOUNTS.forEach((feeAmount) => {
      describe(`should return correct tick range on feeAmount ${feeAmount}`, () => {
        const cases = new Array(3)
          .fill(0)
          .map((_, i) => 1 + 0.3 * i)
          .map((ratio) => ({
            inputToken: token0,
            outputToken: token1,
            marketPrice: 0.0005,
            preferPrice: 0.0005 * ratio,
          }));

        cases.forEach((testCase) => {
          it(`marketPrice: ${testCase.marketPrice} and preferPrice: ${testCase.preferPrice}`, () => {
            const marketPrice = prices.from(
              testCase.inputToken,
              testCase.outputToken,
              testCase.marketPrice
            );
            const preferPrice = prices.from(
              testCase.inputToken,
              testCase.outputToken,
              testCase.preferPrice
            );
            const marketTick = prices.toTick(marketPrice);
            const preferTick = prices.toTick(preferPrice);

            const [tickLower, tickUpper] = calculateTickRange(
              marketPrice,
              preferPrice,
              feeAmount
            );
            const minPrice = tickToPrice(
              testCase.inputToken,
              testCase.outputToken,
              tickLower
            ); // tickLower -> minPrice
            const maxPrice = tickToPrice(
              testCase.inputToken,
              testCase.outputToken,
              tickUpper
            ); // tickUpper -> maxPrice

            // tickLower and tickUpper both be greater than marketTick
            expect(tickLower).toBeGreaterThan(marketTick);
            expect(tickUpper).toBeGreaterThan(marketTick);

            expect(tickLower).toBeLessThan(tickUpper);
            expect(tickUpper).toBeGreaterThan(preferTick);

            expect(minPrice.greaterThan(marketPrice)).toBeTruthy();
            expect(minPrice.lessThan(maxPrice)).toBeTruthy();
            expect(maxPrice.greaterThan(marketPrice)).toBeTruthy();
            expect(maxPrice.greaterThan(preferPrice)).toBeTruthy();
          });
        });
      });
    });
  });
});
