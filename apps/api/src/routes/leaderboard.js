const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { wallet: true },
    orderBy: { wallet: { pointsBalance: "desc" } },
    take: 20
  });
  return res.json(
    users.map((user) => ({
      id: user.id,
      nickname: user.nickname,
      points: user.wallet?.pointsBalance || 0
    }))
  );
});

module.exports = router;
