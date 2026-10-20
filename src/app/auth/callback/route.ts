import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/admin/login?invite_error=1", url.origin));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Unable to exchange the Supabase invitation code.", error.code);
    return NextResponse.redirect(new URL("/admin/login?invite_error=1", url.origin));
  }
  return NextResponse.redirect(new URL("/admin/set-password", url.origin));
}
