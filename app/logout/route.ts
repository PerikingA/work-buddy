import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createServerSupabase();

  // 1. Tell Supabase to invalidate the session
  await supabase.auth.signOut(); 

  // 2. Create the response and redirect
  const response = NextResponse.redirect(`${origin}/login`, {
    status: 302,
  });

  // 3. Force-clear the specific Supabase auth cookies
  // Replace 'sb-your-project-id-auth-token' with your actual cookie name if different
  // Or use a loop to clear all 'sb-' cookies
  const cookieStore = request.headers.get("cookie");
  if (cookieStore) {
    const cookies = cookieStore.split(";");
    cookies.forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (name.includes("auth-token")) {
        response.cookies.set(name, "", { maxAge: 0 });
      }
    });
  }

  return response;
}