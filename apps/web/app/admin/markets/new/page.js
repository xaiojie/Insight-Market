"use client";

import { useState } from "react";

export default function AdminMarketNewPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [endTime, setEndTime] = useState("");
  const [disputeEndTime, setDisputeEndTime] = useState("");
  const [resolutionSource, setResolutionSource] = useState("");
  const [resolutionRule, setResolutionRule] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    const token = window.localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/markets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({
        title,
        description,
        category,
        endTime,
        disputeEndTime,
        resolutionSource,
        resolutionRule
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "创建失败");
      return;
    }
    setMessage("创建成功");
  };

  return (
    <div className="max-w-xl space-y-3">
      <h1 className="text-2xl font-semibold">创建市场</h1>
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="描述"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="类别"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="到期时间（ISO）"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="争议期截止时间（ISO）"
        value={disputeEndTime}
        onChange={(e) => setDisputeEndTime(e.target.value)}
      />
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="裁决来源"
        value={resolutionSource}
        onChange={(e) => setResolutionSource(e.target.value)}
      />
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="裁决规则"
        value={resolutionRule}
        onChange={(e) => setResolutionRule(e.target.value)}
      />
      <button onClick={submit} className="rounded bg-emerald-600 px-3 py-2 text-sm">
        创建
      </button>
      {message && <div className="text-xs text-amber-400">{message}</div>}
    </div>
  );
}
