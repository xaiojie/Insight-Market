"use client";

import { useState } from "react";

export default function AdminResolvePage() {
  const [marketId, setMarketId] = useState("");
  const [result, setResult] = useState("YES");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    const token = window.localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/resolve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({ marketId: Number(marketId), result, evidenceUrl, note })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "裁决失败");
      return;
    }
    setMessage("裁决成功");
  };

  return (
    <div className="max-w-md space-y-3">
      <h1 className="text-2xl font-semibold">裁决管理</h1>
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="市场 ID"
        value={marketId}
        onChange={(e) => setMarketId(e.target.value)}
      />
      <select
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        value={result}
        onChange={(e) => setResult(e.target.value)}
      >
        <option value="YES">YES</option>
        <option value="NO">NO</option>
      </select>
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="证据链接"
        value={evidenceUrl}
        onChange={(e) => setEvidenceUrl(e.target.value)}
      />
      <textarea
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="说明"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button onClick={submit} className="rounded bg-emerald-600 px-3 py-2 text-sm">
        提交裁决
      </button>
      {message && <div className="text-xs text-amber-400">{message}</div>}
    </div>
  );
}
