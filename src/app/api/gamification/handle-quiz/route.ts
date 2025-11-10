import { NextResponse } from "next/server";
import { handleQuizCompletion } from "@/lib/actions/companion.actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await handleQuizCompletion(body);

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("❌ handleQuizCompletion error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
