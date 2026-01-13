const express = require("express");
const Joi = require("joi");
const prisma = require("../lib/prisma");
const logger = require("../lib/logger");
const { authMiddleware } = require("../middleware/auth");
const { amm } = require("@insight/shared");

const router = express.Router();

const tradeSchema = Joi.object({
  marketId: Joi.number().required(),
  side: Joi.string().valid("YES", "NO").required(),
  points: Joi.number().positive().required()
});

router.post("/", authMiddleware, async (req, res) => {
  const { error, value } = tradeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "参数校验失败", detail: error.message });
  }

  const market = await prisma.market.findUnique({
    where: { id: value.marketId },
    include: { pool: true }
  });
  if (!market || !market.pool) {
    return res.status(404).json({ message: "市场不存在" });
  }
  if (market.status !== "LIVE") {
    return res.status(400).json({ message: "市场当前不可交易" });
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId: req.user.id } });
  if (!wallet || wallet.pointsBalance < value.points) {
    return res.status(400).json({ message: "积分余额不足" });
  }

  const priceBefore = amm.getPrices({
    yesReserve: market.pool.yesReserve,
    noReserve: market.pool.noReserve
  });

  let tradeResult;
  if (value.side === "YES") {
    tradeResult = amm.buyYes(market.pool, value.points, market.pool.feeRate);
  } else {
    tradeResult = amm.buyNo(market.pool, value.points, market.pool.feeRate);
  }

  const priceAfter = tradeResult.prices;
  const sharesOut = tradeResult.shares;
  const abnormal = value.points >= 5000;
  if (abnormal) {
    logger.warn(`异常大额交易: user=${req.user.id} points=${value.points}`);
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { userId: req.user.id },
      data: {
        pointsBalance: { decrement: value.points }
      }
    });

    const position = await tx.position.upsert({
      where: { userId_marketId: { userId: req.user.id, marketId: market.id } },
      update: {
        yesShares: value.side === "YES" ? { increment: sharesOut } : undefined,
        noShares: value.side === "NO" ? { increment: sharesOut } : undefined,
        cost: { increment: value.points }
      },
      create: {
        userId: req.user.id,
        marketId: market.id,
        yesShares: value.side === "YES" ? sharesOut : 0,
        noShares: value.side === "NO" ? sharesOut : 0,
        cost: value.points
      }
    });

    await tx.ammPool.update({
      where: { marketId: market.id },
      data: {
        yesReserve: tradeResult.pool.yesReserve,
        noReserve: tradeResult.pool.noReserve
      }
    });

    const trade = await tx.trade.create({
      data: {
        userId: req.user.id,
        marketId: market.id,
        side: value.side,
        pointsIn: value.points,
        sharesOut,
        priceYesBefore: priceBefore.yesPrice,
        priceNoBefore: priceBefore.noPrice,
        priceYesAfter: priceAfter.yesPrice,
        priceNoAfter: priceAfter.noPrice
      }
    });

    await tx.priceHistory.create({
      data: {
        marketId: market.id,
        yesPrice: priceAfter.yesPrice,
        noPrice: priceAfter.noPrice
      }
    });

    return { trade, position };
  });

  req.app.locals.broadcast?.(
    `market:${market.id}`,
    JSON.stringify({
      type: "price_update",
      marketId: market.id,
      prices: priceAfter,
      pool: tradeResult.pool
    })
  );

  return res.json({
    trade: result.trade,
    position: result.position,
    prices: priceAfter
  });
});

module.exports = router;
