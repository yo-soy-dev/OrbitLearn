"use client";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface XPStats {
  xp: number;
  level: number;
  streak: number;
}

export default function XPLevelCard() {
  const [stats, setStats] = useState<XPStats | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/gamification/profile");
      const data = await res.json();
       console.log("🧩 Profile stats fetched:", data);
      setStats(data);
    };
    load();
  }, []);

  if (!stats) return null;

  // ✅ Level System (Change anytime)
  const xp = stats.xp ?? 0;
  const level = stats.level && stats.level > 0 ? stats.level : 1;

  const xpNeeded = level * 100;
  const progress = xpNeeded > 0 ? (xp % xpNeeded) / xpNeeded * 100 : 0;
  const xpToNext = xpNeeded - (xp % xpNeeded);

  console.log(`🎯 XP: ${xp}, Level: ${level}, Progress: ${progress}%`);

  return (
    <div className="p-5 bg-white border rounded-2xl shadow-sm flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Your Progress</h2>

      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">{stats.level}</p>
        <p className="text-muted-foreground">Level</p>
      </div>

      <Progress value={progress} className="h-2" />

      <p className="text-sm text-muted-foreground">
        {xp} XP • {xpToNext} XP to next level
      </p>
    </div>
  );
}
