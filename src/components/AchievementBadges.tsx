"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Badge {
  id: number;
  badge: string;
  earned_at: string;
}

export default function AchievementBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const load = async () => {
      console.log("🎯 Fetching user achievements...");
      try {
        const res = await fetch("/api/gamification/achievements");

        if (!res.ok) {
          console.error("❌ Failed to fetch achievements:", res.status, res.statusText);
          return;
        }

        const data = await res.json();
        console.log("✅ Raw API response:", data);

        if (Array.isArray(data)) {
          setBadges(data);
          console.log("🏆 Parsed achievements list:", data);
        } else {
          console.warn("⚠️ Response is not an array:", data);
          setBadges([]);
        }
      } catch (err) {
        console.error("🔥 Error loading achievements:", err);
      }
    };

    load();
  }, []);

  const allBadges = [
    "first-quiz",
    "perfect-score",
    "7-day-streak",
    "study-master",
    "companion-creator",
    "fast-learner",
  ];

  console.log("📋 All possible badges:", allBadges);
  console.log("🥇 User unlocked badges:", badges.map((b) => b.badge));

  return (
    <div className="p-5 bg-white border rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Achievements</h2>

      <div className="grid grid-cols-3 gap-4">
        {allBadges.map((badge) => {
          const unlocked = badges.some((b) => b.badge === badge);
          console.log(`🔹 Badge "${badge}" is ${unlocked ? "Unlocked ✅" : "Locked 🔒"}`);

          return (
            <div
              key={badge}
              className={`flex flex-col items-center p-3 rounded-xl 
                ${unlocked ? "bg-yellow-100" : "bg-gray-100 opacity-50"}
              `}
            >
              <Image
                src={`/badges/${badge}.png`}
                alt={badge}
                width={60}
                height={60}
              />
              <p className="text-sm mt-2 capitalize">{badge.replace("-", " ")}</p>
              {unlocked && (
                <p className="text-xs text-green-700 mt-1 font-semibold">Unlocked</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
