"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    setMessage("");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "登录失败");
      return;
    }
    window.localStorage.setItem("token", data.token);
    setMessage("登录成功");
  };

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">登录</h1>
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
        placeholder="密码"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={submit} className="w-full rounded bg-emerald-600 py-2 text-sm">
        登录
      </button>
      {message && <div className="text-xs text-amber-400">{message}</div>}
    </div>
  );
}
