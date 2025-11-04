'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@lib/supabase";
import { sendEmail } from "@/lib/mail";

export const recordVapiTalk = async (companionId: string, transcript: string) => {
  console.log("📞 recordVapiTalk called with:", { companionId, transcriptLength: transcript?.length });

  const { userId } = await auth();
  console.log("🧑 Clerk auth result:", { userId });
  if (!userId) throw new Error("Not authenticated");

  const supabase = createSupabaseClient();
  const user = await currentUser();
  console.log("👤 Clerk currentUser:", {
    id: user?.id,
    email: user?.emailAddresses?.[0]?.emailAddress,
    firstName: user?.firstName,
  });

  // 1️⃣ Record in session history
  console.log("🧾 Inserting into Supabase:", { companionId, userId });
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
    const email = user?.emailAddresses?.[0]?.emailAddress;
    const userName = user?.firstName || "Learner";
    console.log("📧 Preparing to send email to:", email);

    if (email) {
      await sendEmail(
        email,
        "🗣️ New Vapi Session Completed",
        `
          <div style="font-family:Arial,sans-serif;line-height:1.5;">
            <h2>Hello ${userName},</h2>
            <p>Your recent voice session with your AI companion was successfully recorded.</p>
            <p><strong>Companion ID:</strong> ${companionId}</p>
            <p><strong>Summary:</strong> ${transcript?.slice(0, 150) || "No transcript available..."}</p>
            <p>Keep learning and improving every day! 🚀</p>
            <p style="margin-top:20px;">— The Companion AI Team</p>
          </div>
        `
      );
      console.log("✅ Email successfully sent to:", email);
    } else {
      console.warn("⚠️ No email found for user:", userId);
    }
  } catch (emailError) {
    console.error("❌ Failed to send email:", emailError);
  }

  return data;
};
