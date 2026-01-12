# Insight Market（全球化积分预测市场）

## 一、环境要求
- Node.js 18+
- pnpm 9+
- MySQL 8.x

## 二、配置 .env
复制根目录 `.env.example` 为 `.env`，并填写数据库与密钥信息：
```bash
cp .env.example .env
```

## 三、初始化数据库与迁移
```bash
pnpm install
pnpm db:migrate
pnpm db:seed
```

## 四、运行开发环境
```bash
pnpm dev
```

## 五、访问地址与默认账号
- 前端：http://localhost:3000
- 后端：http://localhost:4000
- 管理员账号：admin@insight.com / Admin123!
- 普通用户账号：user1@insight.com / User123!

## 六、核心业务说明（积分制）
- 平台仅支持 Prediction Points 积分，不可兑换任何法币或虚拟货币。
- AMM 采用恒定乘积模型 `k = yesReserve * noReserve`。
- YES 概率 = yesReserve / (yesReserve + noReserve)，NO 概率同理。
- 手续费默认 1%，并进入池子储备。

## 七、Postman/HTTP 示例
### 注册
```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "demo@insight.com",
  "password": "Demo123!",
  "nickname": "演示用户"
}
```

### 登录
```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "user1@insight.com",
  "password": "User123!"
}
```

### 下单买 YES
```
POST http://localhost:4000/api/trades
Authorization: Bearer <token>
Content-Type: application/json

{
  "marketId": 1,
  "side": "YES",
  "points": 300
}
```

### 创建争议
```
POST http://localhost:4000/api/disputes
Authorization: Bearer <token>
Content-Type: application/json

{
  "marketId": 1,
  "stake": 200,
  "reason": "裁决证据不足"
}
```

## 八、页面结构说明（文字版）
1. 首页 `/`
   - 顶部导航（市场/我的持仓/排行榜/后台）
   - 市场卡片网格：标题、类别、概率、截止时间
2. 市场详情 `/market/[id]`
   - 市场信息卡：规则、来源、到期时间
   - 交易面板：YES/NO 切换、输入积分、提交
   - 概率历史折线图
3. 我的持仓 `/portfolio`
   - 按市场列表展示 YES/NO 份额、投入成本、市场状态
4. 排行榜 `/leaderboard`
   - 用户排行列表（昵称、积分）
5. 登录/注册 `/login` `/register`
   - 表单输入、提交按钮、提示信息
6. 后台市场管理 `/admin/markets`
   - 市场列表与状态

## 九、MVP 已实现清单
- 用户注册/登录/JWT 鉴权
- 市场列表、详情、概率展示
- AMM 买入 YES/NO 交易、价格历史记录
- 持仓与排行榜
- 管理员裁决与争议管理流程
- WebSocket 订阅市场价格更新
- Prisma + MySQL 数据结构与种子数据
- Jest AMM 单元测试

## 十、待扩展清单
- 完整结算与收益分配
- 交易卖出逻辑与订单撤销
- 更精细的风控规则与告警系统
- 更丰富的图表与运营后台
- 全量国际化文案管理

## 常见问题排查
- 无法连接数据库：确认 `.env` 中 `DATABASE_URL` 正确、MySQL 服务已启动。
- 端口被占用：修改 `.env` 中 `PORT` 并更新 `NEXT_PUBLIC_API_URL`。
