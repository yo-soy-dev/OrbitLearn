import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { getLastTranscript } from "@/lib/actions/companion.actions";

const apiKey = process.env.OPENAI_API_KEY!;
console.log("🔑 Loaded API Key:", apiKey ? "YES" : "NO");

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

console.log("🔑 API KEY (first 10 chars):", apiKey?.slice(0, 10));


interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
    difficulty?: string;
    subject?: string;
}

export async function POST(req: Request) {
    try {
        console.log("📥 Incoming Quiz Request...");

        const body = await req.json();
        console.log("📥 Request JSON:", body);


        const { transcript, difficulty = "Easy", subject = "Maths" } = body;



        if (!transcript || transcript.trim() === "") {
            console.log("❌ Transcript empty!");
            return NextResponse.json(
                { error: "Transcript cannot be empty" },
                { status: 400 }
            );
        }

        //         const prompt = `
        //       Generate exactly 3 multiple-choice questions in JSON format only, covering the following subjects: 
        //       Maths, Economics, Language, Science, History, Coding, Geography, Finance, and Business. 
        //       Each question should include exactly 4 options and clearly indicate the correct answer. 
        //       Use the transcript below as the source material. Do not add extra text, explanation, or commentary outside the JSON array.
        //       [
        //         {
        //           "question": "",
        //           "options": ["", "", "", ""],
        //           "answer": "",
        //           "difficulty": "easy | medium | hard"
        //   }
        //         }
        //       ]
        //       Text:
        //       ${transcript}
        //     `;
        const prompt = `
        Generate exactly 3 multiple-choice questions in JSON format only.
        Each question should have exactly 4 options and clearly indicate the correct answer.
        Difficulty: ${difficulty}
        Subject: ${subject}
        Use the transcript below as the source material.
        Do not add extra text outside the JSON array.

[
  {
    "question": "",
    "options": ["", "", "", ""],
    "answer": "",
    "difficulty": "${difficulty}",
    "subject": "${subject}"
  }
]

Transcript:
${transcript}
        `;

        console.log("📤 Sending prompt to Gemini...");
        console.log("📝 Prompt:", prompt);

        await new Promise((r) => setTimeout(r, 1500));

        // ✅ Real Gemini request
        const result = await model.generateContent(prompt);

        console.log("✅ Gemini Raw Result:", JSON.stringify(result, null, 2));

        const text = result.response.text();
        console.log("📝 Gemini Response Text:", text);

        // ✅ Extract JSON block only
        const match = text.match(/\[[\s\S]*\]/);
        console.log("🔍 Extracted JSON Match:", match);

        let parsed: QuizQuestion[] = [];

        try {
            parsed = match ? JSON.parse(match[0]) : [];
            console.log("✅ Parsed JSON:", parsed);
        } catch (err) {
            console.log("❌ JSON Parse Error:", err);
            console.log("❌ Raw Text For Debug:", text);
        }

        return NextResponse.json({ quiz: parsed });

    } catch (error: any) {
        console.log("🔥 Gemini Error Caught:", error);

        // Google API errors include detailed info
        console.log("📛 Error Details:", error?.errorDetails);
        console.log("📛 Status:", error?.status);
        console.log("📛 Status Text:", error?.statusText);

        return NextResponse.json(
            { error: "Quiz generation failed", details: error?.message },
            { status: 500 }
        );
    }
}