import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";


export const createSupabaseClient = (isService = false) => {
  if (isService) {
    // 🛡️ Used in server-only code like webhooks
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // <-- bypass RLS
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken();
      }
    }
  );
};
