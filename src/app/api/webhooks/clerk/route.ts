// import { Webhook } from "svix";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";
// import { createSupabaseClient } from "@/lib/supabase";

// const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

// export async function POST(req: Request) {
//   const payload = await req.text();
//   const headerList = await headers();

//   const svix_id = headerList.get("svix-id");
//   const svix_timestamp = headerList.get("svix-timestamp");
//   const svix_signature = headerList.get("svix-signature");

//   if (!svix_id || !svix_timestamp || !svix_signature)
//     return new Response("Missing svix headers", { status: 400 });

//   let evt: { type: string; data: any };
//   try {
//     const wh = new Webhook(WEBHOOK_SECRET);
//     evt = wh.verify(payload, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     }) as { type: string; data: any };
//   } catch (err) {
//     console.error("❌ Clerk webhook verification failed:", err);
//     return new Response("Invalid signature", { status: 400 });
//   }

//   if (evt.type === "user.created") {
//     const { id } = evt.data;
//     const supabase = createSupabaseClient();

//     const { error } = await supabase.from("users").insert({
//       id,
//       plan: "free",
//       created_at: new Date().toISOString(),
//     });

//     if (error) console.error("❌ Supabase insert failed:", error);
//     else console.log(`✅ Added Clerk user ${id} to Supabase`);
//   }

//   return NextResponse.json({ success: true });
// }

import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const headerList = await headers(); // ❌ no need to `await headers()`, it’s synchronous

  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Clerk webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createSupabaseClient();

  // Handle both creation and update (optional)
  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id } = evt.data;

    const { error } = await supabase.from("users").upsert({
      id,
      plan: "basic", // ✅ better default name (matches your pricing plans)
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("❌ Supabase insert failed:", error);
    } else {
      console.log(`✅ Synced Clerk user ${id} to Supabase`);
    }
  }

  return NextResponse.json({ success: true });
}
