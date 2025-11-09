// import { NextResponse } from "next/server";
// import { getUserAchievements, unlockAchievement } from "@/lib/actions/companion.actions";

// export async function GET() {
//   try {
//     const achievements = await getUserAchievements();
//     return NextResponse.json({ achievements });
//   } catch (error: any) {
//     console.error("❌ /achievements GET Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const { badge } = await req.json();
//     if (!badge) return NextResponse.json({ error: "Badge is required" }, { status: 400 });

//     const achievement = await unlockAchievement(badge);
//     return NextResponse.json({ achievement });
//   } catch (error: any) {
//     console.error("❌ /achievements POST Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
