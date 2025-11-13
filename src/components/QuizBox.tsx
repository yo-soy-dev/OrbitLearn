"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Brain, Star } from "lucide-react";

const QuizBox = () => {
  const router = useRouter();

  return (
    <div className="relative w-full bg-gradient-to-br from-[#003B46] via-[#032B43] to-[#07575B] text-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col justify-center items-center text-center transition-transform duration-300 hover:scale-[1.01]">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00000033] via-transparent to-transparent pointer-events-none"></div>

      {/* Tag */}
      <div className="relative inline-flex items-center gap-2 bg-[#FAED27] text-black font-semibold px-4 py-1.5 rounded-full mb-5 shadow-[0_2px_10px_rgba(252,204,65,0.4)]">
        💡 Challenge Yourself
      </div>

      {/* Title */}
      <h2 className="relative text-2xl md:text-3xl font-bold mb-3 leading-tight tracking-tight">
        Take a Quick Quiz
      </h2>

      {/* Subtitle */}
      <p className="relative text-gray-200 text-sm md:text-base max-w-xl mb-10">
        Test your knowledge and boost your learning streak.  
        Get instant AI-powered feedback after each quiz!
      </p>

      {/* Icons */}
      <div className="relative flex justify-center gap-6 md:gap-8 mb-10 flex-wrap">
        <div className="bg-white/10 p-3.5 md:p-4 rounded-2xl backdrop-blur-md shadow-inner hover:scale-110 transition">
          <Brain size={28} className="text-[#FCCC41]" />
        </div>
        <div className="bg-white/10 p-3.5 md:p-4 rounded-2xl backdrop-blur-md shadow-inner hover:scale-110 transition">
          <Star size={28} className="text-pink-400" />
        </div>
        <div className="bg-white/10 p-3.5 md:p-4 rounded-2xl backdrop-blur-md shadow-inner hover:scale-110 transition">
          <Sparkles size={28} className="text-[#00E676]" />
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => router.push("/quiz")}
        className="relative bg-gradient-to-r from-[#00C853] to-[#AEEA00] text-black font-semibold px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(0,200,83,0.4)] hover:shadow-[0_6px_25px_rgba(0,200,83,0.6)] hover:scale-105 transition"
      >
        🚀 Start Quiz Now
      </button>

      {/* Decorative Glow */}
      <div className="absolute -bottom-12 -right-10 w-44 h-44 bg-[#66A5AD]/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#FCCC41]/30 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
};

export default QuizBox;
