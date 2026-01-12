const express = require("express");
const Joi = require("joi");
const prisma = require("../lib/prisma");
const { authMiddleware, adminOnly } = require("../middleware/auth");

const router = express.Router();

const profileSchema = Joi.object({
  nickname: Joi.string().min(2).required(),
  region: Joi.string().allow(""),
  language: Joi.string().valid("zh", "en").required()
});

router.get("/me", authMiddleware, async (req, res) => {
  return res.json(req.user);
});

router.put("/me", authMiddleware, async (req, res) => {
  const { error, value } = profileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "参数校验失败", detail: error.message });
  }
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: value
  });
  return res.json(user);
});

router.get("/admin/users", authMiddleware, adminOnly, async (req, res) => {
  const users = await prisma.user.findMany({
    include: { wallet: true }
  });
  return res.json(users);
});

router.patch("/admin/users/:id/ban", authMiddleware, adminOnly, async (req, res) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { status: "BANNED" }
  });
  return res.json(user);
});

router.patch("/admin/users/:id/unban", authMiddleware, adminOnly, async (req, res) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { status: "ACTIVE" }
  });
  return res.json(user);
});

module.exports = router;
