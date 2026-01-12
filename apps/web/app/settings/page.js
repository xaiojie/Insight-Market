"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [nickname, setNickname] = useState("");
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("zh");
  const [message, setMessage] = useState("");

  const submit = async () => {
    const token = window.localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({ nickname, region, language })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "保存失败");
      return;
    }
    setMessage("保存成功");
  };

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">个人设置</h1>
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="昵称"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="地区"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      />
      <select
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
      <button onClick={submit} className="w-full rounded bg-emerald-600 py-2 text-sm">
        保存
      </button>
      {message && <div className="text-xs text-amber-400">{message}</div>}
    </div>
  );
}
