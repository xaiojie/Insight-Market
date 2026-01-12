const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { amm } = require("@insight/shared");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);
  const userHash = await bcrypt.hash("User123!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@insight.com",
      password: passwordHash,
      nickname: "管理员",
      role: "ADMIN",
      wallet: { create: { pointsBalance: 100000, pointsLocked: 0 } }
    }
  });

  await prisma.user.create({
    data: {
      email: "user1@insight.com",
      password: userHash,
      nickname: "小明",
      wallet: { create: { pointsBalance: 5000, pointsLocked: 0 } }
    }
  });
  await prisma.user.create({
    data: {
      email: "user2@insight.com",
      password: userHash,
      nickname: "小红",
      wallet: { create: { pointsBalance: 5000, pointsLocked: 0 } }
    }
  });
  await prisma.user.create({
    data: {
      email: "user3@insight.com",
      password: userHash,
      nickname: "小蓝",
      wallet: { create: { pointsBalance: 5000, pointsLocked: 0 } }
    }
  });

  const now = new Date();
  const twoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const fourDays = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
  const fiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const sixDays = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);

  const marketsData = [
    {
      title: "2024 年全球碳排放是否下降？",
      description: "以联合国数据为准。",
      category: "环境",
      status: "LIVE",
      endTime: threeDays,
      disputeEndTime: new Date(threeDays.getTime() + 48 * 60 * 60 * 1000),
      resolutionSource: "联合国官方报告",
      resolutionRule: "以官方报告为最终裁决"
    },
    {
      title: "某 AI 模型是否在 Q4 达到 1 亿用户？",
      description: "以公司财报披露为准。",
      category: "科技",
      status: "LIVE",
      endTime: fourDays,
      disputeEndTime: new Date(fourDays.getTime() + 48 * 60 * 60 * 1000),
      resolutionSource: "公司财报",
      resolutionRule: "财报披露为最终裁决"
    },
    {
      title: "2024 年世界杯冠军是否为欧洲球队？",
      description: "以 FIFA 官方结果为准。",
      category: "体育",
      status: "CLOSED",
      endTime: now,
      disputeEndTime: new Date(now.getTime() + 48 * 60 * 60 * 1000),
      resolutionSource: "FIFA 官方公告",
      resolutionRule: "官方公告为最终裁决"
    },
    {
      title: "某国 GDP 是否在 2024 年增长超过 5%？",
      description: "以官方统计局为准。",
      category: "宏观",
      status: "LIVE",
      endTime: fiveDays,
      disputeEndTime: new Date(fiveDays.getTime() + 48 * 60 * 60 * 1000),
      resolutionSource: "国家统计局",
      resolutionRule: "官方统计为最终裁决"
    },
    {
      title: "某知名电影是否在 30 天破 10 亿票房？",
      description: "以公开票房平台为准。",
      category: "娱乐",
      status: "DRAFT",
      endTime: sixDays,
      disputeEndTime: new Date(sixDays.getTime() + 48 * 60 * 60 * 1000),
      resolutionSource: "票房平台",
      resolutionRule: "平台数据为最终裁决"
    },
    {
      title: "某公司是否在年底前完成 IPO？",
      description: "以交易所公告为准。",
      category: "财经",
      status: "LIVE",
      endTime: twoDays,
      disputeEndTime: new Date(twoDays.getTime() + 48 * 60 * 60 * 1000),
      resolutionSource: "交易所公告",
      resolutionRule: "交易所公告为最终裁决"
    }
  ];

  for (const data of marketsData) {
    const market = await prisma.market.create({
      data
    });
    const initialYes = 5000;
    const initialNo = 5000;
    const prices = amm.getPrices({ yesReserve: initialYes, noReserve: initialNo });
    await prisma.ammPool.create({
      data: {
        marketId: market.id,
        yesReserve: initialYes,
        noReserve: initialNo,
        feeRate: 0.01
      }
    });
    await prisma.priceHistory.create({
      data: {
        marketId: market.id,
        yesPrice: prices.yesPrice,
        noPrice: prices.noPrice
      }
    });
  }

  await prisma.auditLog.create({
    data: {
      action: "seed",
      detail: "初始化数据",
      operator: admin.email
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
