// "use client";

// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// interface Props {
//   sessionHistory: { createdAt?: string; created_at?: string }[];
// }

// export default function ProgressCharts({ sessionHistory }: Props) {
//   const grouped: Record<string, number> = {};

//   sessionHistory.forEach(s => {
//     const rawDate = s.createdAt || s.created_at || ""; 

//     const date = new Date(rawDate);
//     if (isNaN(date.getTime())) return;

//     const day = date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });

//     grouped[day] = (grouped[day] || 0) + 1;
//   });

//   const chartData = Object.entries(grouped).map(([day, count]) => ({
//     day,
//     count
//   }));

//   return (
//     <div className="p-5 rounded-xl border shadow-sm bg-white">
//       <h2 className="text-xl font-bold mb-4">📊 Learning Progress</h2>

//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={chartData}>
//             <XAxis dataKey="day" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

interface Props {
  sessionHistory: {
    createdAt?: string;
    created_at?: string;
    confidence_score?: number;
  }[];
}

export default function ProgressCharts({ sessionHistory }: Props) {
  const grouped: Record<string, { total: number; count: number }> = {};

  sessionHistory.forEach((s) => {
    const rawDate = s.createdAt || s.created_at || "";
    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return;

    const day = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const confidence = typeof s.confidence_score === "number" ? s.confidence_score : 0;

    if (!grouped[day]) grouped[day] = { total: 0, count: 0 };
    grouped[day].total += confidence;
    grouped[day].count += 1;
  });

  const chartData = Object.entries(grouped).map(([day, { total, count }]) => ({
    day,
    avgConfidence: count ? Math.round(total / count) : 0,
    lessons: count,
  }));

  return (
    <motion.div
      className="p-5 rounded-xl border shadow-sm bg-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        📊 Learning Progress
        <span className="text-sm font-medium text-gray-400">(Confidence & Lessons)</span>
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fill: "#6b7280" }} />
            <YAxis domain={[0, 100]} tick={{ fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                background: "#fff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
              formatter={(value, name) => [
                name === "avgConfidence"
                  ? `${value}%`
                  : `${value} lesson${value !== 1 ? "s" : ""}`,
                name === "avgConfidence" ? "Confidence" : "Lessons",
              ]}
            />
            <Bar
              dataKey="avgConfidence"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={900}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
