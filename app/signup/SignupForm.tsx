"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) router.push("/dashboard");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const signup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);
    // auto-redirect handled by onAuthStateChange
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <button onClick={signup} className="bg-black text-white px-4 py-2">
        Sign Up
      </button>
    </div>
  );
}