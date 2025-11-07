import { NextResponse } from "next/server";
import { recordVapiTalk } from "@/lib/actions/talk.actions";
import { saveTranscript } from "@/lib/actions/companion.actions";


export async function POST(req: Request) {
  try {
    const { companionId, transcript } = await req.json();

    console.log("📥 /api/vapi/record received:", { companionId, transcriptLength: transcript?.length });

    const result = await recordVapiTalk(companionId, transcript);

     await saveTranscript(companionId, transcript);

    console.log("✅ recordVapiTalk completed:", result);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Error in /api/vapi/record:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
