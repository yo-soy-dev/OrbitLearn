"use client";

import { useUser } from "@clerk/nextjs";
import { GraduationCap, Sparkles, MessageSquare, BookOpen, Brain } from "lucide-react";

const WelcomeBox = () => {
  const { user } = useUser();
  const displayName = user?.firstName || user?.username || "Learner";

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mt-6 mb-8 text-white shadow-lg bg-gradient-to-r from-[#003B46] via-[#002B36] to-[#001F29]">
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF3131]/30 rounded-full blur-3xl"></div>

      {/* Welcome Tag (Bold Red background) */}
      <div className="inline-block bg-[#FF3131] text-white font-medium px-3 py-1 rounded-full mb-3 shadow-md">
        Welcome back 👋
      </div>

      {/* Main Heading (Bold Red text) */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[#FF3131] drop-shadow-[0_0_10px_rgba(255,49,49,0.5)]">
        Hello {displayName}, Ready to Learn?
      </h2>

      {/* Subtext */}
      <p className="text-gray-200 mb-4">
        Explore new lessons, continue your journey, and build your personalized Study Buddy today.
      </p>

      {/* Icons Row */}
      <div className="flex flex-wrap gap-3 mt-4">
        {[GraduationCap, BookOpen, Brain, MessageSquare, Sparkles].map((Icon, i) => (
          <div key={i} className="bg-white/10 hover:bg-white/20 transition p-3 rounded-xl">
            <Icon size={24} />
          </div>
        ))}
      </div>

      {/* Built by Tag (Bold Red styling) */}
      <div className="absolute bottom-4 right-4 bg-[#FF3131] text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md border border-red-400 backdrop-blur-sm">
        Built by Soy_Yo Dev 💻
      </div>

      {/* Soft red glow */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FF3131]/20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default WelcomeBox;
