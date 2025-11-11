import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    first_name?: string;
    last_name?: string;
  };
}

export async function POST(req: Request) {
  const payload = await req.text();

  // ✅ Works across all Next versions
  const headerList = (await headers()) as unknown as Headers;

  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing Clerk webhook headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  let evt: ClerkWebhookEvent;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("❌ Clerk webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("✅ Clerk Event Received:", evt.type);

  const supabase = createSupabaseClient();

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses?.[0]?.email_address || "";

    const { error } = await supabase.from("users").upsert({
      id,
      email,
      first_name,
      last_name,
      plan: "free",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("❌ Supabase insert failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ User synced to Supabase: ${email}`);
  }

  return NextResponse.json({ success: true });
}
