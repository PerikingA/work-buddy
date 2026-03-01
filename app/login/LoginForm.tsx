"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) router.push("/dashboard");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const login = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    return alert(error.message);
  }

  if (data.session) {
    // 1. Force the browser to sync cookies with the server
    router.refresh(); 
    
    // 2. Use a small timeout or direct push to ensure the cookie is 'set' 
    // before the Middleware runs for the /dashboard request
    window.location.href = "/dashboard"; 
  }
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
      <button onClick={login} className="bg-black text-white px-4 py-2">
        Login
      </button>
    </div>
  );
}