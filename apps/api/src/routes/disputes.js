const express = require("express");
const Joi = require("joi");
const prisma = require("../lib/prisma");
const { authMiddleware, adminOnly } = require("../middleware/auth");

const router = express.Router();

const disputeSchema = Joi.object({
  marketId: Joi.number().required(),
  stake: Joi.number().positive().required(),
  reason: Joi.string().min(5).required()
});

router.post("/", authMiddleware, async (req, res) => {
  const { error, value } = disputeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "参数校验失败", detail: error.message });
  }
  const market = await prisma.market.findUnique({ where: { id: value.marketId } });
  if (!market || market.status !== "DISPUTE") {
    return res.status(400).json({ message: "当前市场不在争议期" });
  }
  const wallet = await prisma.wallet.findUnique({ where: { userId: req.user.id } });
  if (!wallet || wallet.pointsBalance < value.stake) {
    return res.status(400).json({ message: "积分余额不足" });
  }
  const dispute = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { userId: req.user.id },
      data: {
        pointsBalance: { decrement: value.stake },
        pointsLocked: { increment: value.stake }
      }
    });
    return tx.dispute.create({
      data: {
        marketId: value.marketId,
        userId: req.user.id,
        stake: value.stake,
        reason: value.reason
      }
    });
  });
  return res.json(dispute);
});

router.get("/admin/disputes", authMiddleware, adminOnly, async (req, res) => {
  const disputes = await prisma.dispute.findMany({
    include: { market: true, user: true }
  });
  return res.json(disputes);
});

router.post("/admin/disputes/:id/decision", authMiddleware, adminOnly, async (req, res) => {
  const { status, resultNote } = req.body;
  const dispute = await prisma.dispute.findUnique({ where: { id: Number(req.params.id) } });
  if (!dispute) {
    return res.status(404).json({ message: "争议不存在" });
  }
  const updated = await prisma.$transaction(async (tx) => {
    await tx.dispute.update({
      where: { id: dispute.id },
      data: { status, resultNote }
    });
    if (status === "ACCEPTED") {
      await tx.wallet.update({
        where: { userId: dispute.userId },
        data: {
          pointsLocked: { decrement: dispute.stake },
          pointsBalance: { increment: dispute.stake }
        }
      });
    }
    if (status === "REJECTED") {
      await tx.wallet.update({
        where: { userId: dispute.userId },
        data: {
          pointsLocked: { decrement: dispute.stake }
        }
      });
    }
    return tx.dispute.findUnique({ where: { id: dispute.id } });
  });
  return res.json(updated);
});

module.exports = router;
