"use client";

import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaderboard`)
      .then((res) => res.json())
      .then((data) => setItems(data || []));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">排行榜</h1>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex justify-between border-b border-slate-800 py-2 text-sm">
            <span>
              #{index + 1} {item.nickname}
            </span>
            <span>{item.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
