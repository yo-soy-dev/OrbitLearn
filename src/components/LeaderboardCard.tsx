// "use client";

// import { useEffect, useState } from "react";

// interface UserRank {
//   user_id: string;
//   xp: number;
//   level: number;
//   name: string;
//   avatar: string;
// }

// export default function LeaderboardCard() {
//   const [leaders, setLeaders] = useState<UserRank[]>([]);

//   useEffect(() => {
//     const load = async () => {
//       const res = await fetch("/api/gamification/leaderboard");
//       const data = await res.json();
//       console.log("🏆 Leaderboard fetched:", data); 
//       setLeaders(Array.isArray(data) ? data : []);
//     };
//     load();
//   }, []);

//   if (leaders.length === 0)
//     return (
//       <div className="p-5 bg-white border rounded-2xl shadow-sm text-center text-muted-foreground">
//         No leaderboard data yet — start learning to climb ranks! 🚀
//       </div>
//     );

//   return (
//     <div className="p-5 bg-white border rounded-2xl shadow-sm">
//       <h2 className="text-xl font-semibold mb-4">Top Learners</h2>

//       <div className="flex flex-col gap-4">
//         {leaders.map((u, i) => (
//           <div key={i} className="flex items-center gap-3">
//             <span className="text-2xl font-bold w-8">{i + 1}</span>

//             <img
//               src={u.avatar || "/icons/avatar-placeholder.png"}
//                onError={(e) => {
//                 console.warn("⚠️ Avatar failed:", u);
//                 e.currentTarget.src = "/icons/avatar-placeholder.png";
//               }}
//               className="w-10 h-10 rounded-full"
//             />

//             <div className="flex-1">
//               <p className="font-semibold">{u.name}</p>
//               <p className="text-xs text-muted-foreground">{u.xp} XP</p>
//             </div>

//             <span className="text-sm font-semibold">Lvl {u.level}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

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
      console.log("🏆 Leaderboard fetched:", data);
      setLeaders(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  if (leaders.length === 0)
    return (
      <div className="p-6 bg-gradient-to-br from-orange-100 to-green-50 border border-orange-200 rounded-2xl shadow-md text-center text-gray-600">
        No leaderboard data yet — start learning to climb ranks! 🚀
      </div>
    );

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 0:
        return "text-yellow-500";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-amber-600";
      default:
        return "text-green-600";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-white to-orange-50 border border-green-200 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-5 text-green-700">🏆 Top Learners</h2>

      <div className="flex flex-col gap-5">
        {leaders.map((u, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white hover:bg-green-50 transition-all p-3 rounded-xl shadow-sm"
          >
            <span className={`text-2xl font-bold w-8 ${getRankColor(i)}`}>
              {i + 1}
            </span>

            <img
              src={u.avatar || "/icons/avatar-placeholder.png"}
              onError={(e) => {
                console.warn("⚠️ Avatar failed:", u);
                e.currentTarget.src = "/icons/avatar-placeholder.png";
              }}
              className="w-12 h-12 rounded-full border border-green-300"
            />

            <div className="flex-1">
              <p className="font-semibold text-gray-800">{u.name}</p>
              <p className="text-xs text-gray-500">{u.xp} XP</p>
            </div>

            <span className="text-sm font-semibold text-green-700">
              Lvl {u.level}
            </span>
          </div>
        ))}
      </div>

      {/* <p className="text-xs text-center text-gray-400 mt-6">
        Built by <span className="text-green-600 font-semibold">Soy Yo Dev</span> 💻
      </p> */}
    </div>
  );
}

