// // ✅ Correct file: src/app/api/gamification/update-progress/route.ts

// import { NextResponse } from "next/server";
// import { updateUserProgress } from "@/lib/actions/companion.actions";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const result = await updateUserProgress(body);

//     return NextResponse.json({ success: true, ...result });
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message },
//       { status: 500 }
//     );
//   }
// }
