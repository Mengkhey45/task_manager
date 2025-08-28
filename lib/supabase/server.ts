import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              // Next.js cookies().set expects a single object argument
              cookieStore.set({ name, value, ...(options as Record<string, any> || {}) })
            )
          } catch (e) {
            // The setAll method may be called from a Server Component or
            // in contexts where cookies cannot be mutated. Silently ignore
            // failures here to preserve existing behavior.
          }
        },
      },
    },
  );
};