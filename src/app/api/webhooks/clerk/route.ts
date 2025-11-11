import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();

  // ✅ FIX — cast so TS knows this is not a Promise
  const headerList = headers() as unknown as Headers;


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

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id } = evt.data;
    const { error } = await supabase.from("users").upsert({
      id,
      plan: "free",
      created_at: new Date().toISOString(),
      expired_at: null,
    });

    if (error) console.error("❌ Supabase insert failed:", error);
    else console.log(`✅ Synced Clerk user ${id} to Supabase`);
  }

  return NextResponse.json({ success: true });
}
