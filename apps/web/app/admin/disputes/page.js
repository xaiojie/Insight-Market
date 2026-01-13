"use client";

import { useEffect, useState } from "react";

export default function AdminDisputesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/disputes/admin/disputes`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" }
    })
      .then((res) => res.json())
      .then((data) => setItems(data || []));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">争议管理</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded border border-slate-800 bg-slate-900 p-4">
            <div className="font-semibold">{item.market.title}</div>
            <div className="text-xs text-slate-500">用户：{item.user.nickname}</div>
            <div className="text-xs text-slate-500">状态：{item.status}</div>
            <div className="text-xs text-slate-500">原因：{item.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
