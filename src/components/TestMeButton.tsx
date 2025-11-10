"use client";

import { useRouter } from "next/navigation";

export default function TestMeButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/quiz");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-primary text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary/80 hover:scale-105 transition-all duration-200"
    >
      🧠 Test Me
    </button>
  );
}
