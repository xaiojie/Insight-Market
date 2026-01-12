const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const prisma = require("../lib/prisma");

const router = express.Router();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  nickname: Joi.string().min(2).required()
});

router.post("/register", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "参数校验失败", detail: error.message });
  }
  const exists = await prisma.user.findUnique({ where: { email: value.email } });
  if (exists) {
    return res.status(400).json({ message: "邮箱已注册" });
  }
  const password = await bcrypt.hash(value.password, 10);
  const user = await prisma.user.create({
    data: {
      email: value.email,
      password,
      nickname: value.nickname,
      wallet: { create: { pointsBalance: 1000, pointsLocked: 0 } }
    }
  });
  return res.json({ id: user.id, email: user.email, nickname: user.nickname });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }, include: { wallet: true } });
  if (!user) {
    return res.status(401).json({ message: "邮箱或密码错误" });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ message: "邮箱或密码错误" });
  }
  if (user.status === "BANNED") {
    return res.status(403).json({ message: "账号已被封禁" });
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "2h"
  });
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      language: user.language,
      role: user.role,
      wallet: user.wallet
    }
  });
});

module.exports = router;
