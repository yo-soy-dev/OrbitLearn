import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ active: false });

  const supabase = createSupabaseClient(true);

  const { data: user, error } = await supabase
    .from("users")
    .select("plan, expired_at")
    .eq("id", userId)
    .single();

  if (error || !user) return NextResponse.json({ active: false });

  const now = new Date();
  const expiry = user.expired_at ? new Date(user.expired_at) : null;
  const active =
    expiry && now < expiry && (user.plan === "core" || user.plan === "pro");

  return NextResponse.json({ active });
}
