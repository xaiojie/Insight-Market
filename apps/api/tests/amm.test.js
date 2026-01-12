const { amm } = require("@insight/shared");

describe("AMM 买入逻辑", () => {
  test("买入 YES 后概率上升", () => {
    const pool = { yesReserve: 5000, noReserve: 5000 };
    const before = amm.getPrices(pool);
    const result = amm.buyYes(pool, 1000, 0.01);
    expect(result.prices.yesPrice).toBeGreaterThan(before.yesPrice);
  });

  test("买入 NO 后概率上升", () => {
    const pool = { yesReserve: 5000, noReserve: 5000 };
    const before = amm.getPrices(pool);
    const result = amm.buyNo(pool, 1000, 0.01);
    expect(result.prices.noPrice).toBeGreaterThan(before.noPrice);
  });
});
