"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

interface Companion {
  id: string;
  name: string;
  subject: string;
  topic: string;
  duration: number;
  summary?: string[];
  takeaways?: string[];
  next_steps?: string[];
  confidence_score?: number;
}

// Animated timeline section
const TimelineSection = ({
  title,
  emoji,
  items,
  colorClass,
  itemEmoji,
}: {
  title: string;
  emoji: string;
  items: string[];
  colorClass: string;
  itemEmoji: string;
}) => {
  const [open, setOpen] = useState(true);

  if (!items || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex relative mb-10 last:mb-0"
    >
      {/* Timeline Line */}
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: "100%" }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-4 w-1 bg-gray-300"
      />

      {/* Marker */}
      <div className="z-10 flex-shrink-0 w-8 h-8 rounded-full bg-white border-4 border-current text-center text-xl font-bold flex items-center justify-center">
        {emoji}
      </div>

      {/* Content */}
      <div className={`ml-6 p-4 rounded-lg shadow ${colorClass} w-full`}>
        <button
          onClick={() => setOpen(!open)}
          className="flex justify-between items-center w-full font-bold text-lg mb-2 focus:outline-none"
        >
          <span>{title}</span>
          <span>{open ? "▲" : "▼"}</span>
        </button>
        {open && (
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {items.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 hover:text-gray-900 transition"
              >
                <span>{itemEmoji}</span>
                {item}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

const ViewSummaryContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [companion, setCompanion] = useState<Companion | null>(null);

  const companionId = searchParams.get("id");

  useEffect(() => {
    if (!companionId) return;

    const fetchCompanion = async () => {
      try {
        const res = await fetch(`/api/companions/${companionId}`, {
    //   cache: "no-store", // forces fresh fetch
    }
        );
        if (!res.ok) throw new Error("Failed to fetch companion");
        const data: Companion = await res.json();
        setCompanion(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanion();
  }, [companionId]);

  if (!companion) return <p className="text-center py-10 text-lg animate-pulse">⏳ Loading session details...</p>;

  const {
    name,
    subject,
    topic,
    duration,
    summary = [],
    takeaways = [],
    next_steps = [],
    confidence_score,
  } = companion;

  const confidenceEmoji =
    confidence_score !== undefined
      ? confidence_score > 80
        ? "💪"
        : confidence_score > 50
        ? "🙂"
        : "⚠️"
      : "";

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2"
      >
        ← Back
      </button>

      {/* Session Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-extrabold mb-1">{name} 📚</h1>
          <p className="text-gray-600 text-lg">
            Subject: <span className="font-semibold">{subject}</span> | Topic:{" "}
            <span className="font-semibold">{topic}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Image src="/icons/clock.svg" alt="duration" width={20} height={20} />
          <span>{duration} mins ⏱️</span>
        </div>
      </motion.div>

      {/* Confidence Score */}
      {confidence_score !== undefined && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white shadow rounded-lg p-4 flex items-center gap-3 mb-10"
        >
          <span className="text-2xl">{confidenceEmoji}</span>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">📊 Confidence Score</h2>
            <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
              <div
                className={`h-5 rounded-full transition-all duration-700 ${
                  confidence_score > 80
                    ? "bg-green-500"
                    : confidence_score > 50
                    ? "bg-yellow-400"
                    : "bg-red-500"
                }`}
                style={{ width: `${confidence_score}%` }}
              />
            </div>
            <p className="mt-1 font-medium">{confidence_score}%</p>
          </div>
        </motion.div>
      )}

      {/* Timeline Sections */}
      <TimelineSection
        title="Summary"
        emoji="📝"
        items={summary}
        colorClass="bg-blue-50 border-l-4 border-blue-500"
        itemEmoji="📝"
      />
      <TimelineSection
        title="Key Takeaways"
        emoji="💡"
        items={takeaways}
        colorClass="bg-green-50 border-l-4 border-green-500"
        itemEmoji="💡"
      />
      <TimelineSection
        title="Next Steps"
        emoji="🚀"
        items={next_steps}
        colorClass="bg-yellow-50 border-l-4 border-yellow-500"
        itemEmoji="✅"
      />

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-8">
        🎯 Your learning journey: 📝 Summary → 💡 Takeaways → 🚀 Next Steps
      </div>
    </main>
  );
};

export default ViewSummaryContent;
