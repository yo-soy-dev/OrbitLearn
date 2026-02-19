import { NextResponse } from "next/server";
import { recordVapiTalk } from "@/lib/actions/talk.actions";
import { saveTranscript, saveSessionInsights } from "@/lib/actions/companion.actions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.OPENAI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
  try {
    const { companionId, transcript } = await req.json();

    console.log("📥 /api/vapi/record received:", { companionId });

    await recordVapiTalk(companionId, transcript);
    const session = await saveTranscript(companionId, transcript);

    const prompt = `
You are an AI learning coach.

Here is the student's conversation transcript:
""" 
${transcript}
"""

Generate STRICT JSON ONLY in this format:

{
  "summary": "short summary",
  "takeaways": ["point 1", "point 2", "point 3"],
  "next_steps": ["topic 1", "topic 2", "topic 3"],
  "confidence_score": 1-100
}
`;

    console.log("📤 Sending prompt to Gemini...");

    await new Promise((r) => setTimeout(r, 1500));

    const aiResult = await model.generateContent(prompt);
    const text = aiResult.response.text();

    console.log("📝 Gemini Raw Output:", text);

    // ✅ 3. Extract JSON reliably
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("❌ AI did not return JSON.");
      return NextResponse.json({ success: false, error: "AI JSON parse error" });
    }

    const insights = JSON.parse(jsonMatch[0]);

    console.log("✅ Parsed Insights:", insights);

    const { summary, takeaways, next_steps, confidence_score } = insights;

    // ✅ 4. Save summary + insights in Supabase
    await saveSessionInsights({
      sessionId: session.id,
      summary: [summary],
      takeaways,
      next_steps,
      confidence_score,
    });


    return NextResponse.json({ success: true, insights });

  } catch (error) {
    console.error("❌ Error in /api/vapi/record:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
