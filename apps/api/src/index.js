require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { WebSocketServer } = require("ws");
const logger = require("./lib/logger");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const marketRoutes = require("./routes/markets");
const tradeRoutes = require("./routes/trades");
const positionRoutes = require("./routes/positions");
const adminRoutes = require("./routes/admin");
const disputeRoutes = require("./routes/disputes");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "请求过于频繁，请稍后重试" }
});
app.use(limiter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/markets", marketRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

const server = app.listen(process.env.PORT || 4000, () => {
  logger.info(`API 服务启动: ${process.env.PORT || 4000}`);
});

const wss = new WebSocketServer({ server });
const subscriptions = new Map();

function broadcast(topic, message) {
  for (const client of wss.clients) {
    const subs = subscriptions.get(client);
    if (client.readyState === 1 && subs?.has(topic)) {
      client.send(message);
    }
  }
}

app.locals.broadcast = broadcast;

wss.on("connection", (ws) => {
  subscriptions.set(ws, new Set());
  ws.on("message", (data) => {
    try {
      const payload = JSON.parse(data.toString());
      if (payload.type === "subscribe") {
        subscriptions.get(ws).add(payload.topic);
      }
      if (payload.type === "unsubscribe") {
        subscriptions.get(ws).delete(payload.topic);
      }
    } catch (error) {
      logger.warn("WebSocket 消息解析失败");
    }
  });
  ws.on("close", () => {
    subscriptions.delete(ws);
  });
});
