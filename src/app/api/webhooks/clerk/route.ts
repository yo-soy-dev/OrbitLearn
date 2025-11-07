import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { createSupabaseClient } from "@/lib/supabase";
import { createClerkClient } from "@clerk/backend";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY!;

const clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });

export async function POST(req: Request) {
  const payload = await req.text();
  const headerList = await headers();

  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  let evt: any;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "subscription.created" || eventType === "subscription.updated") {
    const userId = evt.data.user_id;
    const plan = evt.data.plan_id || "free";

    const supabase = createSupabaseClient();

    const { error} = await supabase.from("users").update({ plan }).eq("id", userId);

    if (error) console.error("Supabase update failed:", error);

    try {
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { plan },
    });
    } catch (err) {
    console.error("Clerk metadata update failed:", err);
  }


    console.log(`✅ Updated user ${userId} plan to ${plan}`);
  }

  return NextResponse.json({ success: true });
}
