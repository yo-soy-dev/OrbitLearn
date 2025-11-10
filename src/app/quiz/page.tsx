
"use client";
import { useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export default function QuizUI() {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("Easy");
  const [subject, setSubject] = useState("Maths");

  const [progress, setProgress] = useState<any>(null);

  const generateQuiz = async () => {
    setLoading(true);
    setChecked(false);
    setSelected({});
    setQuiz(null);

    const res = await fetch("/api/quiz/generate", {
      method: "POST",
      body: JSON.stringify({
        transcript: `Generate quiz for ${subject} with difficulty ${difficulty}`,
        difficulty,
        subject,
      }),
    });

    const data = await res.json();
    setQuiz(data.quiz || []);
    setLoading(false);
  };

  const score = quiz
    ? quiz.filter((q, i) => selected[i] === q.answer).length
    : 0;

  const handleCheck = async () => {
    if (!quiz) return;
    console.log("✅ handleCheck triggered");
    setChecked(true);

    const calculatedScore = quiz
      ? quiz.filter((q, i) => selected[i] === q.answer).length
      : 0;

    console.log("✅ Calculated Score:", calculatedScore);
    console.log("✅ Total Questions:", quiz?.length || 0);
    console.log("✅ Difficulty:", difficulty);
    console.log("✅ Subject:", subject);

    try {
      console.log("📤 Sending XP update request to /api/gamification/update-progress");
      const res = await fetch("/api/gamification/update-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: calculatedScore,
          total: quiz?.length || 0,
          difficulty,
          subject,
        }),
      });
      console.log("📥 Response received. Status:", res.status);

      const data = await res.json().catch((err) => {
      console.error("❌ Failed to parse JSON response:", err);
      return null;
    });

      if (!data) {
      console.error("❌ No data returned from API");
      return;
    }
      if (data.success) {
      console.log("✅ XP Update Success");
      console.log("✅ XP Earned:", data.xpEarned);
      console.log("✅ Total XP:", data.totalXP);
      console.log("✅ Level:", data.level);
      console.log("✅ Streak:", data.streak);

       console.log("📤 Checking achievements via /api/gamification/handle-quiz");
    const res2 = await fetch("/api/gamification/handle-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: calculatedScore,
        total: quiz.length,
        difficulty,
        subject,
      }),
    });

    const achievementData = await res2.json();
    console.log("🏆 Achievements response:", achievementData);

        setProgress({
          xp: data.totalXP,
          xpEarned: data.xpEarned,
          level: data.level,
          streak: data.streak,
        });
        console.log("✅ progress state updated:", {
        xp: data.totalXP,
        xpEarned: data.xpEarned,
        level: data.level,
        streak: data.streak,
        achievements: achievementData.achievements || [],
      });
      } else {
      console.error("❌ XP update failed:", data.message || data);
    }
    } catch (err) {
      console.error("XP update failed:", err);
    }
  };


  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl border border-gray-200">
      {progress && (
        <div className="mb-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-300">
          <p className="font-semibold text-yellow-800">
            ⭐ XP Earned: +{progress.xpEarned}
          </p>
          <p className="text-yellow-700">🔥 Streak: {progress.streak} days</p>
          <p className="text-yellow-700">🏆 Level: {progress.level}</p>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">Smart Quiz</h1>

      {!quiz && (
        <div className="flex gap-4 mb-4">
          {/* Difficulty */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="flex-1 p-3 border rounded-xl shadow-sm bg-gray-50 text-gray-700"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          {/* Subject */}
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 p-3 border rounded-xl shadow-sm bg-gray-50 text-gray-700"
          >
            <option>Maths</option>
            <option>Economics</option>
            <option>Language</option>
            <option>Science</option>
            <option>History</option>
            <option>Coding</option>
            <option>Geography</option>
            <option>Finance</option>
            <option>Business</option>
          </select>
        </div>
      )}



      {!quiz && (
        <button
          onClick={generateQuiz}
          className="w-full bg-primary text-white py-3 rounded-2xl text-lg font-semibold shadow-md hover:brightness-90 transition"
        >
          Generate Quiz
        </button>
      )}

      {loading && (
        <p className="text-center py-4 text-gray-500 animate-pulse">Generating questions...</p>
      )}

      {quiz && (
        <>
          {quiz.map((q, idx) => (
            <div key={idx} className="mb-6 p-5 border rounded-2xl bg-gray-50 hover:shadow-md transition">
              <h2 className="font-semibold mb-3 text-lg">
                {idx + 1}. {q.question}
              </h2>

              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, i) => {
                  const isCorrect = checked && opt === q.answer;
                  const isWrong =
                    checked && selected[idx] === opt && opt !== q.answer;

                  return (
                    <button
                      key={i}
                      onClick={() =>
                        !checked &&
                        setSelected({ ...selected, [idx]: opt })
                      }
                      className={`
                        text-left px-4 py-2 rounded-xl border transition shadow-sm
                        ${isCorrect
                          ? "border-yellow-600 bg-yellow-100"
                          : isWrong
                            ? "border-red-600 bg-red-100"
                            : selected[idx] === opt
                              ? "border-blue-600 bg-blue-100"
                              : "border-gray-300 bg-white"
                        }
                      `}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!checked && (
            <button
              // onClick={() => setChecked(true)}
                onClick={handleCheck}
              className="w-full bg-primary text-white py-3 rounded-xl text-lg hover:brightness-90 transition shadow-md"
            >
              Check Answers
            </button>
          )}

          {checked && (
            <div className="text-center mt-6">
              <p className="text-xl font-bold text-gray-800">
                Your Score: {score} / {quiz.length}
              </p>

              <button
                onClick={() => setQuiz(null)}
                className="mt-4 w-full bg-primary text-white py-3 rounded-xl font-semibold hover:brightness-90 transition"
              >
                Generate New Quiz
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}