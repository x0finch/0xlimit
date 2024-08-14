import { Token } from "@uniswap/sdk-core";
import JSBI from "jsbi";
import { calculateMaxOutput } from "./use-max-output";

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
        "68.999999999999999876",
        weth,
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
        "3.45823510",
        wbtc,
        weth,
        260200,
        260210
      );
      expect(maxOutput.quotient).toEqual(JSBI.BigInt("68999999959754359466"));
    });

    it("should return correct max output, wbtc to usdt", () => {
      const maxOutput = calculateMaxOutput("0.002", wbtc, usdt, 65280, 65340);
      expect(maxOutput.quotient).toEqual(JSBI.BigInt("137171992"));
    });
  });
});
