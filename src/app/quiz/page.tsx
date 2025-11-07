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

  // ✅ Fetch quiz from API
  const generateQuiz = async () => {
    setLoading(true);
    setChecked(false);
    setSelected({});

    const res = await fetch("/api/quiz/generate", {
      method: "POST",
      body: JSON.stringify({
        transcript: "This is a sample transcript to generate questions from.",
      }),
    });

    const data = await res.json();
    setQuiz(data.quiz || []);
    setLoading(false);
  };

  // ✅ Calculate score
  const score = quiz
    ? quiz.filter((q, i) => selected[i] === q.answer).length
    : 0;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">AI Quiz Generator</h1>

      {/* ✅ Generate Button */}
      {!quiz && (
        <button
          onClick={generateQuiz}
          className="w-full bg-red-500 text-white py-3 rounded-xl text-lg font-medium hover:bg-red-600 transition"
        >
          Generate Quiz
        </button>
      )}

      {/* ✅ Loading Spinner */}
      {loading && (
        <p className="text-center py-4 text-gray-600">Generating...</p>
      )}

      {/* ✅ Quiz Rendering */}
      {quiz && (
        <>
          {quiz.map((q, idx) => (
            <div key={idx} className="mb-6 p-4 border rounded-xl bg-gray-50">
              <h2 className="font-semibold mb-3">
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
                        text-left px-4 py-2 rounded-lg border
                        ${
                          isCorrect
                            ? "border-green-600 bg-green-100"
                            : isWrong
                            ? "border-red-600 bg-red-100"
                            : selected[idx] === opt
                            ? "border-blue-600 bg-blue-100"
                            : "border-gray-300"
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

          {/* ✅ Check Answer Button */}
          {!checked && (
            <button
              onClick={() => setChecked(true)}
              className="w-full bg-green-600 text-white py-3 rounded-xl text-lg hover:bg-green-700 transition"
            >
              Check Answers
            </button>
          )}

          {/* ✅ Score Display + Regenerate */}
          {checked && (
            <div className="text-center mt-6">
              <p className="text-xl font-semibold">
                Your Score: {score} / {quiz.length}
              </p>

              <button
                onClick={() => setQuiz(null)}
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
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
