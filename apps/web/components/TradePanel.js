"use client";

import { useState } from "react";

export default function TradePanel({ marketId }) {
  const [side, setSide] = useState("YES");
  const [points, setPoints] = useState(100);
  const [message, setMessage] = useState("");

  const submit = async () => {
    setMessage("");
    try {
      const token = window.localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ marketId, side, points: Number(points) })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "下单失败");
        return;
      }
      setMessage("下单成功，概率已更新");
    } catch (error) {
      setMessage("网络错误");
    }
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="text-sm text-slate-300 mb-2">交易面板</div>
      <div className="flex gap-2 mb-3">
        <button
          className={`px-3 py-2 rounded ${side === "YES" ? "bg-emerald-500" : "bg-slate-800"}`}
          onClick={() => setSide("YES")}
        >
          买 YES
        </button>
        <button
          className={`px-3 py-2 rounded ${side === "NO" ? "bg-rose-500" : "bg-slate-800"}`}
          onClick={() => setSide("NO")}
        >
          买 NO
        </button>
      </div>
      <input
        type="number"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="输入积分"
      />
      <button onClick={submit} className="mt-3 w-full rounded bg-emerald-600 py-2 text-sm">
        下单
      </button>
      {message && <div className="mt-2 text-xs text-amber-400">{message}</div>}
    </div>
  );
}
