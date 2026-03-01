import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: { headers: req.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, {
              ...options,
              maxAge: value === "" ? 0 : 3600, // Force 1 hour
              path: "/",
            })
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const url = req.nextUrl.clone();
  const isAuthPage = ["/", "/login", "/signup"].includes(url.pathname);

  // 1. If logged in and trying to access Landing/Login/Signup -> Dashboard
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. If NOT logged in and trying to access Dashboard -> Login
  if (!user && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};