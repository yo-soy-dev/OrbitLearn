// import { NextResponse } from "next/server";
// import { getLeaderboard } from "@/lib/actions/companion.actions";

// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const limit = Number(url.searchParams.get("limit")) || 10;

//     const leaderboard = await getLeaderboard(limit);
//     return NextResponse.json({ leaderboard });
//   } catch (error: any) {
//     console.error("❌ /leaderboard Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

