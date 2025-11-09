"use client";

import { useEffect, useState } from "react";

interface UserRank {
  user_id: string;
  xp: number;
  level: number;
  name: string;
  avatar: string;
}

export default function LeaderboardCard() {
  const [leaders, setLeaders] = useState<UserRank[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/gamification/leaderboard");
      const data = await res.json();
      setLeaders(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  return (
    <div className="p-5 bg-white border rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Top Learners</h2>

      <div className="flex flex-col gap-4">
        {leaders.map((u, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-2xl font-bold w-8">{i + 1}</span>

            <img
              src={u.avatar}
              className="w-10 h-10 rounded-full"
            />

            <div className="flex-1">
              <p className="font-semibold">{u.name}</p>
              <p className="text-xs text-muted-foreground">{u.xp} XP</p>
            </div>

            <span className="text-sm font-semibold">Lvl {u.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
