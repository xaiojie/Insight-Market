"use client";

export default function PriceChart({ history }) {
  if (!history || history.length === 0) {
    return <div className="text-sm text-slate-400">暂无价格历史</div>;
  }
  const max = Math.max(...history.map((item) => item.yesPrice));
  const min = Math.min(...history.map((item) => item.yesPrice));
  const points = history
    .map((item, index) => {
      const x = (index / (history.length - 1 || 1)) * 280;
      const y = 80 - ((item.yesPrice - min) / (max - min || 1)) * 60;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="text-sm text-slate-300 mb-2">概率历史（YES）</div>
      <svg width="280" height="80">
        <polyline fill="none" stroke="#34d399" strokeWidth="2" points={points} />
      </svg>
    </div>
  );
}
