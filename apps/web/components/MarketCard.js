import Link from "next/link";

export default function MarketCard({ market }) {
  const price = market.pool
    ? market.pool.yesReserve / (market.pool.yesReserve + market.pool.noReserve)
    : 0.5;
  return (
    <Link
      href={`/market/${market.id}`}
      className="block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-emerald-500"
    >
      <div className="text-lg font-semibold">{market.title}</div>
      <div className="text-sm text-slate-400 mt-1">{market.category}</div>
      <div className="mt-3 text-sm">
        当前概率：<span className="text-emerald-400">{(price * 100).toFixed(1)}%</span>
      </div>
      <div className="mt-2 text-xs text-slate-500">截至：{new Date(market.endTime).toLocaleString()}</div>
    </Link>
  );
}
