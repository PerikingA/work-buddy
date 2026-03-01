// app/page.tsx
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Landing() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard"); // server-side redirect

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">TrailBuddy</h1>
      <p className="text-gray-500">Stay accountable with a partner</p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-black text-white px-4 py-2 rounded">
          Login
        </Link>
        <Link href="/signup" className="border px-4 py-2 rounded">
          Sign Up
        </Link>
      </div>
    </div>
  );
}