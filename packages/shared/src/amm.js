// 简单二元 AMM（恒定乘积）工具
// priceYes = yesReserve / (yesReserve + noReserve)
// priceNo = noReserve / (yesReserve + noReserve)
// 买入 YES：投入 points，扣除手续费后进入 YES 池子
// 份额 = (noReserve * (1 - k / (yesReserve + netPoints))) 近似表达

const DEFAULT_FEE_RATE = 0.01;

function getPrices(pool) {
  const total = pool.yesReserve + pool.noReserve;
  return {
    yesPrice: total === 0 ? 0.5 : pool.yesReserve / total,
    noPrice: total === 0 ? 0.5 : pool.noReserve / total
  };
}

function buyYes(pool, points, feeRate = DEFAULT_FEE_RATE) {
  if (points <= 0) {
    throw new Error("投入积分必须大于 0");
  }
  const fee = points * feeRate;
  const netPoints = points - fee;
  const k = pool.yesReserve * pool.noReserve;
  const newYesReserve = pool.yesReserve + netPoints;
  const newNoReserve = k / newYesReserve;
  const shares = pool.noReserve - newNoReserve;
  return {
    shares,
    fee,
    pool: {
      yesReserve: newYesReserve,
      noReserve: newNoReserve
    },
    prices: getPrices({ yesReserve: newYesReserve, noReserve: newNoReserve })
  };
}

function buyNo(pool, points, feeRate = DEFAULT_FEE_RATE) {
  if (points <= 0) {
    throw new Error("投入积分必须大于 0");
  }
  const fee = points * feeRate;
  const netPoints = points - fee;
  const k = pool.yesReserve * pool.noReserve;
  const newNoReserve = pool.noReserve + netPoints;
  const newYesReserve = k / newNoReserve;
  const shares = pool.yesReserve - newYesReserve;
  return {
    shares,
    fee,
    pool: {
      yesReserve: newYesReserve,
      noReserve: newNoReserve
    },
    prices: getPrices({ yesReserve: newYesReserve, noReserve: newNoReserve })
  };
}

module.exports = {
  DEFAULT_FEE_RATE,
  getPrices,
  buyYes,
  buyNo
};
