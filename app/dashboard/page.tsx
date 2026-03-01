import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  // if (!user) redirect("/login");

  return (
    <div className="p-10 text-3xl font-bold flex flex-col gap-4">
      Dashboard Logged In
      <a
        href="/logout"
        className="bg-red-500 text-white px-4 py-2 rounded w-32 text-center"
      >
        Logout
      </a>
    </div>
  );
}