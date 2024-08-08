import { CurrencyAmount, Token } from "@uniswap/sdk-core";
import { prices } from "~/lib";
import { calculateMaxOutput, calculateTickerRange } from "./helper";
import { FeeAmount, TICK_SPACINGS, tickToPrice } from "@uniswap/v3-sdk";
import JSBI from "jsbi";

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

describe("calculateTickerRange", () => {
  describe("when inputToken is token1 and outputToken is token0", () => {
    ALL_FEE_AMOUNTS.forEach((feeAmount) => {
      describe(`should return correct ticker range on feeAmount ${feeAmount}`, () => {
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
            const marketTicker = prices.toTicker(marketPrice);
            const preferTicker = prices.toTicker(preferPrice);

            const { minTicker, maxTicker } = calculateTickerRange(
              feeAmount,
              marketPrice,
              preferPrice
            );
            const minPrice = tickToPrice(
              testCase.inputToken,
              testCase.outputToken,
              maxTicker
            ); // maxTicker -> minPrice
            const maxPrice = tickToPrice(
              testCase.inputToken,
              testCase.outputToken,
              minTicker
            ); // minTicker -> maxPrice

            // minTicker and maxTicker both be less than marketTicker
            expect(minTicker).toBeLessThan(marketTicker);
            expect(maxTicker).toBeLessThan(marketTicker);

            expect(minTicker).toBeLessThan(preferTicker);
            expect(minTicker).toBeLessThan(maxTicker);

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
      describe(`should return correct ticker range on feeAmount ${feeAmount}`, () => {
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
            const marketTicker = prices.toTicker(marketPrice);
            const preferTicker = prices.toTicker(preferPrice);

            const { minTicker, maxTicker } = calculateTickerRange(
              feeAmount,
              marketPrice,
              preferPrice
            );
            const minPrice = tickToPrice(
              testCase.inputToken,
              testCase.outputToken,
              minTicker
            ); // minTicker -> minPrice
            const maxPrice = tickToPrice(
              testCase.inputToken,
              testCase.outputToken,
              maxTicker
            ); // maxTicker -> maxPrice

            // minTicker and maxTicker both be greater than marketTicker
            expect(minTicker).toBeGreaterThan(marketTicker);
            expect(maxTicker).toBeGreaterThan(marketTicker);

            expect(minTicker).toBeLessThan(maxTicker);
            expect(maxTicker).toBeGreaterThan(preferTicker);

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

const weth = new Token(
  1,
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  18,
  "WETH"
);
const wbtc = new Token(
  1,
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  8,
  "WBTC"
);
const usdt = new Token(
  1,
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  6,
  "USDT"
);

describe("calculateMaxOutput", () => {
  describe("when inputToken is token1 and outputToken is token0", () => {
    it("should return correct max output, weth to wbtc", () => {
      const maxOutput = calculateMaxOutput(
        CurrencyAmount.fromRawAmount(weth, "68999999999999999876"),
        wbtc,
        260200,
        260210
      );
      expect(maxOutput.quotient).toEqual(JSBI.BigInt(345823510));
    });
  });

  describe("when inputToken is token0 and outputToken is token1", () => {
    it("should return correct max output, wbtc to weth", () => {
      const maxOutput = calculateMaxOutput(
        CurrencyAmount.fromRawAmount(wbtc, "345823510"),
        weth,
        260200,
        260210
      );
      expect(maxOutput.quotient).toEqual(JSBI.BigInt("68999999959754359466"));
    });

    it("should return correct max output, wbtc to usdt", () => {
      const maxOutput = calculateMaxOutput(
        CurrencyAmount.fromRawAmount(wbtc, "200000"),
        usdt,
        65280,
        65340
      );
      expect(maxOutput.quotient).toEqual(JSBI.BigInt("137171992"));
    });
  });
});
