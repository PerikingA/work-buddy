// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          cookieStore.getAll().map((c: { name: string; value: string }) => ({
            name: c.name,
            value: c.value,
          })),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              path: "/",
              maxAge: value === "" ? 0 : 3600, // 1 hour
              httpOnly: true,
              sameSite: "lax",
              // secure: process.env.NODE_ENV === "production",
            });
          });
        },
      },
    }
  );
}