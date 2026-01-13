const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "缺少登录令牌" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { wallet: true }
    });
    if (!user) {
      return res.status(401).json({ message: "用户不存在" });
    }
    if (user.status === "BANNED") {
      return res.status(403).json({ message: "账号已被封禁" });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "登录已过期，请重新登录" });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "仅管理员可操作" });
  }
  return next();
}

module.exports = { authMiddleware, adminOnly };
