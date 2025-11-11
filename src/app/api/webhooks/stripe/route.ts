import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseClient } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err: any) {
    console.error("❌ Stripe webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { user_id, plan } = session.metadata || {};

    if (user_id && plan) {
      const supabase = createSupabaseClient();

      // 1-month plan expiry from now
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      const { error } = await supabase
        .from("users")
        .update({
          plan,
          plan_expires_at: expiryDate.toISOString(),
        })
        .eq("id", user_id);

      if (error) {
        console.error("❌ Supabase update failed:", error);
      } else {
        console.log(`✅ User ${user_id} upgraded to '${plan}' plan until ${expiryDate.toDateString()}`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
