"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/users`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" }
    })
      .then((res) => res.json())
      .then((data) => setUsers(data || []));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">用户管理</h1>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="rounded border border-slate-800 bg-slate-900 p-4">
            <div className="font-semibold">{user.nickname}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
            <div className="text-xs text-slate-500">状态：{user.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
