import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserSessions } from "@/lib/actions/companion.actions";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const companionId = params.id;

  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = (await getUserSessions(user.id)).flat();

    // find session by companionId
    const companion = sessions.find((s) => s.id === companionId);

    if (!companion) {
      return NextResponse.json({ error: "Companion not found" }, { status: 404 });
    }

    return NextResponse.json(companion);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
