const express = require("express");
const prisma = require("../lib/prisma");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const positions = await prisma.position.findMany({
    where: { userId: req.user.id },
    include: { market: true }
  });
  return res.json(positions);
});

module.exports = router;
