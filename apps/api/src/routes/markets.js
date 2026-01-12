const express = require("express");
const prisma = require("../lib/prisma");
const { authMiddleware, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const { category, sort = "latest" } = req.query;
  const orderBy = [];
  if (sort === "hot") {
    orderBy.push({ trades: { _count: "desc" } });
  }
  if (sort === "ending") {
    orderBy.push({ endTime: "asc" });
  }
  if (sort === "latest") {
    orderBy.push({ createdAt: "desc" });
  }
  const markets = await prisma.market.findMany({
    where: category ? { category } : undefined,
    include: { pool: true, priceHistory: { take: 1, orderBy: { createdAt: "desc" } } },
    orderBy
  });
  return res.json(markets);
});

router.get("/:id", async (req, res) => {
  const market = await prisma.market.findUnique({
    where: { id: Number(req.params.id) },
    include: { pool: true }
  });
  if (!market) {
    return res.status(404).json({ message: "市场不存在" });
  }
  return res.json(market);
});

router.get("/:id/price-history", async (req, res) => {
  const history = await prisma.priceHistory.findMany({
    where: { marketId: Number(req.params.id) },
    orderBy: { createdAt: "asc" },
    take: 50
  });
  return res.json(history);
});

router.post("/", authMiddleware, adminOnly, async (req, res) => {
  const data = req.body;
  const market = await prisma.market.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      status: "DRAFT",
      endTime: new Date(data.endTime),
      disputeEndTime: new Date(data.disputeEndTime),
      resolutionSource: data.resolutionSource,
      resolutionRule: data.resolutionRule,
      pool: {
        create: {
          yesReserve: data.yesReserve || 5000,
          noReserve: data.noReserve || 5000,
          feeRate: 0.01
        }
      }
    }
  });
  return res.json(market);
});

router.patch("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  const market = await prisma.market.update({
    where: { id: Number(req.params.id) },
    data: { status: req.body.status }
  });
  await prisma.auditLog.create({
    data: {
      action: "market_status",
      detail: `市场 ${market.id} 状态变更为 ${market.status}`,
      operator: req.user.email
    }
  });
  return res.json(market);
});

module.exports = router;
