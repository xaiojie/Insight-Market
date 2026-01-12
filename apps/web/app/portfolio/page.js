"use client";

import { useEffect, useState } from "react";

export default function PortfolioPage() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/positions`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" }
    })
      .then((res) => res.json())
      .then((data) => setPositions(data || []));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">我的持仓</h1>
      <div className="space-y-3">
        {positions.map((pos) => (
          <div key={pos.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="font-semibold">{pos.market.title}</div>
            <div className="text-sm text-slate-400">YES 份额：{pos.yesShares}</div>
            <div className="text-sm text-slate-400">NO 份额：{pos.noShares}</div>
            <div className="text-sm text-slate-400">投入成本：{pos.cost}</div>
            <div className="text-xs text-slate-500">状态：{pos.market.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
