'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@lib/supabase";
import { sendEmail } from "@/lib/mail";


export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();
  const user = await currentUser();

  const { data, error } = await supabase
    .from('companions')
    .insert({ ...formData, author })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to create a companion');

  try {
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    const userName = user?.firstName || "User";

    if (userEmail) {
      await sendEmail(
        userEmail,
        "🎉 Your Companion AI is Ready!",
        `
        <div style="font-family:Arial,sans-serif;line-height:1.5;">
          <h2>Hello ${userName},</h2>
          <p>Your new companion AI <b>${formData.name}</b> has been successfully created! 🚀</p>
          <p>You can now start learning from it anytime.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/companions/${data.id}" 
            style="background:#ef4444;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
            Start Talking
          </a>
          <p style="margin-top:20px;">— The Companion AI Team</p>
        </div>
        `
      );
      console.log(`📧 Email sent successfully to ${userEmail}`);
    }
  } catch (emailError) {
    console.error("❌ Failed to send email:", emailError);
  }

  return data;
};


export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: {
  limit?: number;
  page?: number;
  subject?: string;
  topic?: string;
}) => {
  const supabase = createSupabaseClient();

  let query = supabase.from('companions').select();

  if (subject && topic) {
    query = query.ilike('subject', `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike('subject', `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error) throw new Error(error.message)

  return companions;
};

export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('companions')
    .select()
    .eq('id', id);

  if (error) {
    console.log(error);
    return null;
  }
  return data?.[0] || null;
};

export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .insert({
      companion_id: companionId,
      user_id: userId,
    });

  if (error) throw new Error(error.message);

  return data;
};

export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .select(`id, created_at, confidence_score, companion_id,companions:companion_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data?.map(({ companions }) => companions);
};

export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .select(`id, created_at, confidence_score, summary, takeaways, next_steps, companion_id, companions:companion_id (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data?.map(({ companions, summary, takeaways, next_steps, confidence_score, ...session }) => ({
    ...companions || {},
    ...session,
    summary,
    takeaways,
    next_steps,
    confidence_score,
}));


// // return data?.map(({ companions }) => (companions))
};


// export const getUserSessions = async (userId: string, limit = 10) => {
//   const supabase = createSupabaseClient();

//   const { data, error } = await supabase
//     .from("session_history")
//     .select(`
//       id,
//       duration,
//       confidence_score,
//       summary,
//       takeaways,
//       next_steps,
//       companion_id,
//       companions:companion_id (*)
//     `)
//     .eq("user_id", userId)
//     .order("created_at", { ascending: false })
//     .limit(limit);

//   if (error) throw new Error(error.message);

//   return data?.map(({ companions, summary, takeaways, next_steps, confidence_score, id, duration }) => {
//     const companion = Array.isArray(companions) ? companions[0] : companions;

//     return {
//       sessionId: id,
//       companionId: companion?.id ?? null,
//       name: companion?.name ?? "",
//       subject: companion?.subject ?? "",
//       topic: companion?.topic ?? "",
//       duration: duration ?? 0,
//       summary: summary ? JSON.parse(summary) : [],
//       takeaways: takeaways ? JSON.parse(takeaways) : [],
//       next_steps: next_steps ? JSON.parse(next_steps) : [],
//       confidence_score: confidence_score ?? 0,
//     };
//   }) || [];
// };



export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('companions')
    .select()
    .eq('author', userId);

  if (error) throw new Error(error.message);

  return data;
}

// export const newCompanionPermissions = async () => { 
//   const { userId, has } = await auth(); 
//   const supabase = createSupabaseClient(); 

//   let limit = 0;
//    if (has({ plan: 'pro' })) {
//     return true; 
//     } else if (has({ feature: "3_companion_limit" })) { 
//       limit = 3; 
//     } else if (has({ feature: "10_companion_limit" })) {
//        limit = 10;
//     } 
//     const { data, error } = await supabase
//     .from('companions')
//     .select('id', { count: 'exact' })
//     .eq('author', userId);
//     if (error) throw new Error(error.message); 

//     const companionCount = data?.length;
//     if (companionCount >= limit) {
//        return false 
//       } else { 
//         return true; 
//       } 
//     }





export const newCompanionPermissions = async () => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  const { data: user } = await supabase
    .from("users")
    .select("plan")
    .eq("id", userId)
    .single();

  const plan = user?.plan || "free";
  const { data: companions } = await supabase
    .from("companions")
    .select("id")
    .eq("author", userId);

  const count = companions?.length || 0;

  if (plan === "pro") return true;
  if (plan === "core" && count < 3) return true;
  if (plan === "free" && count < 1) return true;

  return false;
};



const cleanTranscript = (raw: string, minLength = 5): string => {
  const lines = raw
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length >= minLength);

  const seen = new Set<string>();
  const uniqueLines: string[] = [];
  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      uniqueLines.push(line);
    }
  }

  return uniqueLines.join("\n");
};

export async function saveTranscript(companionId: string, transcript: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = createSupabaseClient();
  const cleanedTranscript = cleanTranscript(transcript);

  const { data, error } = await supabase
    .from("session_history")
    .insert({
      companion_id: companionId,
      user_id: userId,
      transcript: cleanedTranscript,
    })
    .select("id") 
    .single();


  if (error) {
    console.error("❌ Error saving transcript:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getLastTranscript(companionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .select("transcript")
    .eq("companion_id", companionId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const transcript = data?.transcript as string | undefined;


  if (error) {
    console.error("❌ getLastTranscript Error:", error);
    return { transcript: null };
  }

  const cleanedTranscript = data?.transcript
    ? cleanTranscript(data.transcript)
    : null;

  return { transcript: cleanedTranscript };
}


export async function saveSessionInsights({
  sessionId,
  summary,
  takeaways = [],
  next_steps = [],
  confidence_score = 0
}: {
  sessionId: string;
  summary: string[];
  takeaways?: string[];
  next_steps?: string[];
  confidence_score?: number;
}) {
  if (!sessionId) throw new Error("Session ID is required");
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = createSupabaseClient();


  const { data, error } = await supabase
    .from("session_history")
    .update({
      summary,
      takeaways,
      next_steps,
      confidence_score,
    })
    .eq("id", sessionId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("❌ Error saving session insights:", error);
    throw new Error(error.message);
  }

  return data;
}
