// import { createClient } from "@supabase/supabase-js";
// import { auth } from "@clerk/nextjs/server";


// export const createSupabaseClient = (isService = false) => {
//   if (isService) {
//     // 🛡️ Used in server-only code like webhooks
//     return createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.SUPABASE_SERVICE_ROLE_KEY! // <-- bypass RLS
//     );
//   }

//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       async accessToken() {
//         return (await auth()).getToken();
//       }
//     }
//   );
// };


import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export const createSupabaseClient = (isService = false) => {
  if (isService) {
    // 🛡️ Used for server-only operations like webhooks (bypasses RLS)
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ full access
    );
  }

  // 🔐 Regular client for authenticated users
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options) => {
          const userAuth = await auth(); // ✅ Await the auth() call
          const token = await userAuth.getToken(); // ✅ Now get the token safely

          if (token) {
            options = options || {};
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${token}`,
            };
          }

          return fetch(url, options);
        },
      },
    }
  );
};
