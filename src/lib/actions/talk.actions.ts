'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@lib/supabase";
import { sendEmail } from "@/lib/mail";

export const recordVapiTalk = async (companionId: string, transcript: string) => {
  console.log("📞 recordVapiTalk called with:", { companionId, transcriptLength: transcript?.length });
  const getTranscript = async (companionId: string): Promise<string> => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select("transcript")
    .eq("companion_id", companionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("❌ Error fetching transcript:", error);
    return "";
  }

  return data?.transcript || "";
};


  // ✅ Clerk authentication
  const { userId } = await auth();
  console.log("🧑 Clerk auth result:", { userId });
  if (!userId) throw new Error("Not authenticated");

  // ✅ Supabase client
  const supabase = createSupabaseClient();

  // ✅ Get full user info
  const user = await currentUser();
  console.log("👤 Clerk currentUser full object:", user);

  const email = user?.emailAddresses?.[0]?.emailAddress;
  const userName = user?.firstName || "Learner";
  console.log("📧 Resolved email & userName:", { email, userName });

  // 1️⃣ Record in session history
  console.log("🧾 Inserting into Supabase:", { companionId, userId, transcriptLength: transcript?.length });
  const { data, error } = await supabase
    .from("session_history")
    .insert({
      companion_id: companionId,
      user_id: userId,
      transcript,
    })
    .select("*");

  console.log("✅ Supabase insert result:", { data, error });
  if (error) throw new Error(error.message);

  // 2️⃣ Send email notification
  try {
    if (!email) {
      console.warn("⚠️ No email found for user, skipping email send", { userId });
    } else {
    // ✅ Check if transcript is available
    if (!transcript || transcript.length === 0) {
      console.log("⏳ Transcript empty, waiting for final transcript...");
    const maxWait = 5000; // 5 seconds
    const interval = 500;

    for (let waited = 0; waited < maxWait; waited += interval) {
      transcript = await getTranscript(companionId); 
      if (transcript && transcript.length > 0) break;
      await new Promise(r => setTimeout(r, interval));
    }
    console.log("📝 Transcript after wait:", transcript?.slice(0, 100));
    } 
      console.log("📨 Sending email to:", email);

      const htmlContent = `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333">
          <h2>Hello ${userName},</h2>
          <p>Your recent voice session with your AI companion was successfully recorded.</p>
          <p><strong>Companion ID:</strong> ${companionId}</p>
          ${
            transcript
              ? `<p><strong>Summary:</strong><br>${transcript.slice(0, 300)}${transcript.length > 300 ? "..." : ""}</p>`
              : `<p><strong>Summary:</strong> No transcript available.</p>`
          }
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/companions/${companionId}"
             style="display:inline-block;margin-top:16px;background:#ef4444;color:white;
             padding:10px 18px;border-radius:8px;text-decoration:none;">
             🔗 View Companion
          </a>
          <p>Keep learning and improving every day! 🚀</p>
          <p style="margin-top:20px;">— The Companion AI Team</p>
        </div>
      `;

      console.log("📄 Email HTML content preview (first 300 chars):", htmlContent.slice(0, 300));

      const startEmailTime = Date.now();
      const result = await sendEmail(email, "🗣️ Your Companion AI Session Summary", htmlContent);
      console.log("✅ sendEmail function result:", result);
      const endEmailTime = Date.now();
      console.log(`✅ sendEmail function result at ${new Date().toISOString()} (took ${endEmailTime - startEmailTime}ms):`, result);
    }
  } catch (emailError) {
    console.error("❌ Failed to send email:", emailError);
  }

  console.log("🏁 recordVapiTalk finished successfully for userId:", userId);
  return data;
};
