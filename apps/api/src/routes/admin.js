const express = require("express");
const Joi = require("joi");
const prisma = require("../lib/prisma");
const { authMiddleware, adminOnly } = require("../middleware/auth");

const router = express.Router();

const resolveSchema = Joi.object({
  marketId: Joi.number().required(),
  result: Joi.string().valid("YES", "NO").required(),
  evidenceUrl: Joi.string().uri().required(),
  note: Joi.string().required()
});

router.post("/resolve", authMiddleware, adminOnly, async (req, res) => {
  const { error, value } = resolveSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "参数校验失败", detail: error.message });
  }
  const market = await prisma.market.findUnique({ where: { id: value.marketId } });
  if (!market) {
    return res.status(404).json({ message: "市场不存在" });
  }
  const resolution = await prisma.$transaction(async (tx) => {
    await tx.market.update({
      where: { id: market.id },
      data: { status: "DISPUTE" }
    });
    return tx.resolution.create({
      data: {
        marketId: market.id,
        result: value.result,
        evidenceUrl: value.evidenceUrl,
        note: value.note,
        operatorId: req.user.id
      }
    });
  });
  await prisma.auditLog.create({
    data: {
      action: "resolve_market",
      detail: `市场 ${market.id} 裁决为 ${value.result}`,
      operator: req.user.email
    }
  });
  return res.json(resolution);
});

module.exports = router;
