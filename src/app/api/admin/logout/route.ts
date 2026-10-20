import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Unable to sign out from Supabase.", error.code);
    return NextResponse.json({ error: "La déconnexion a échoué." }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
