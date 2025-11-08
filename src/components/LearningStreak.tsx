"use client";

import { useEffect, useState } from "react";

interface Props {
    companionList: { createdAt?: string; created_at?: string; confidence_score?: number }[];
}

export default function LearningStreak({ companionList }: Props) {
    const [streak, setStreak] = useState(0);
    const [todayLearned, setTodayLearned] = useState(false);
    const [avgConfidence, setAvgConfidence] = useState(0);

    useEffect(() => {
        if (!companionList.length) return;

        // const dates = companionList.map(s => new Date(s.createdAt).toDateString());
        const dates = companionList
            .map(s => new Date(s.createdAt || s.created_at || ""))
            .filter(d => !isNaN(d.getTime()))
            .map(d => d.toDateString());

        const uniqueDates = Array.from(new Set(dates));

        let currentStreak = 0;
        let dayPointer = new Date();

        while (true) {
            const dateStr = dayPointer.toDateString();

            if (uniqueDates.includes(dateStr)) {
                currentStreak++;
                dayPointer.setDate(dayPointer.getDate() - 1);
            } else {
                break;
            }
        }

        setStreak(currentStreak);
        setTodayLearned(uniqueDates.includes(new Date().toDateString()));

        const validScores: number[] = companionList
      .map((s) => s.confidence_score ?? 0)
      .filter((n) => typeof n === "number" && !isNaN(n));

    if (validScores.length > 0) {
      const avg = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
      setAvgConfidence(avg);
    }
    

    }, [companionList]);


    return (
        <div className="p-5 rounded-xl border shadow-sm bg-white">
            <h2 className="text-xl font-bold mb-2">🔥 Learning Streak</h2>

            <div className="flex items-center gap-3">
                <span className="text-4xl font-bold">{streak} Days</span>
                {todayLearned ? (
                    <span className="text-green-600 font-semibold">✓ Learned Today</span>
                ) : (
                    <span className="text-red-500 font-semibold">Not yet today</span>
                )}
            </div>

            <p className="text-gray-600 mt-2 text-sm">
                Keep going! Consistency builds mastery.
            </p>
             {/* {avgConfidence > 0 && ( 
        <p className="text-sm text-gray-500">
          Confidence Score: <span className="font-semibold">{avgConfidence}%</span>
        </p>
       )} */}
       {/* {avgConfidence > 0 && (
  <div className="mt-4">
    <p className="text-sm font-semibold text-gray-700 mb-1">
      Confidence Score
    </p>
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className="h-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700"
        style={{ width: `${avgConfidence}%` }}
      ></div>
    </div>
    <p className="text-right text-sm text-gray-600 mt-1 font-medium">
      {avgConfidence}%
    </p>
  </div>
)} */}
{avgConfidence > 0 && (
  <div className="mt-4 flex flex-col items-center">
    <div className="relative w-24 h-24">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="42"
          stroke="#e5e7eb"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="48"
          cy="48"
          r="42"
          stroke="#4f46e5"
          strokeWidth="10"
          strokeDasharray={`${avgConfidence * 2.64}, 264`}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-indigo-600">
        {avgConfidence}%
      </span>
    </div>
    <p className="text-sm text-gray-500 mt-1">Confidence Score</p>
  </div>
)}




        </div>
    );
}
