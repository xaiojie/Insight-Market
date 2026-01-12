"use client";

import { useEffect, useState } from "react";

export default function AdminMarketsPage() {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/markets`)
      .then((res) => res.json())
      .then((data) => setMarkets(data || []));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">市场管理</h1>
      <div className="space-y-3">
        {markets.map((market) => (
          <div key={market.id} className="rounded border border-slate-800 bg-slate-900 p-4">
            <div className="font-semibold">{market.title}</div>
            <div className="text-xs text-slate-500">状态：{market.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
