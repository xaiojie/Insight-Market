import TradePanel from "../../../components/TradePanel";
import PriceChart from "../../../components/PriceChart";

async function getMarket(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/markets/${id}`, {
    cache: "no-store"
  });
  return res.json();
}

async function getHistory(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/markets/${id}/price-history`, {
    cache: "no-store"
  });
  return res.json();
}

export default async function MarketDetailPage({ params }) {
  const market = await getMarket(params.id);
  const history = await getHistory(params.id);
  const yesPrice = market.pool
    ? market.pool.yesReserve / (market.pool.yesReserve + market.pool.noReserve)
    : 0.5;
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <h1 className="text-2xl font-semibold">{market.title}</h1>
        <p className="text-slate-400 mt-2">{market.description}</p>
        <div className="mt-3 text-sm text-slate-300">
          裁决来源：{market.resolutionSource}
        </div>
        <div className="text-sm text-slate-300">裁决规则：{market.resolutionRule}</div>
        <div className="text-sm text-slate-300">到期时间：{new Date(market.endTime).toLocaleString()}</div>
        <div className="mt-3 text-sm">
          YES 概率：<span className="text-emerald-400">{(yesPrice * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TradePanel marketId={market.id} />
        <PriceChart history={history} />
      </div>
    </div>
  );
}
