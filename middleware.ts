import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const loginPath = path === "/admin/login";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (loginPath) return NextResponse.next();
    const loginUrl = new URL("/admin/login?config=1", request.url);
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) console.error("Unable to refresh the Supabase administrator session.", error.code);
  if (loginPath) return response;
  if (user) return response;

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", `${path}${request.nextUrl.search}`);
  const redirect = NextResponse.redirect(loginUrl);
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = { matcher: ["/admin/:path*"] };
