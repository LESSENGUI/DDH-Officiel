import { NextResponse } from "next/server";
import { InMemoryRateLimiter } from "@/lib/rate-limit";
import { SupabaseConfigurationError } from "@/lib/supabase/config";
import { logAdminAudit } from "@/lib/supabase/audit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminContext } from "@/lib/supabase/admin";
import { getSafeAdminRedirect, adminLoginSchema } from "@/lib/validation/admin-auth";

const loginLimiter = new InMemoryRateLimiter(8, 15 * 60 * 1000);

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 2_048) return NextResponse.json({ error: "La demande est trop volumineuse." }, { status: 413 });
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = loginLimiter.consume(ip);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Trop de tentatives. Veuillez réessayer plus tard." }, {
      status: 429,
      headers: { "Retry-After": String(rate.retryAfterSeconds) },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "La requête doit contenir un JSON valide." }, { status: 400 });
  }
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Adresse électronique ou mot de passe invalide." }, { status: 400 });

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    if (!(error instanceof SupabaseConfigurationError)) throw error;
    console.error(error.message);
    return NextResponse.json({ error: "Le service de connexion n’est pas configuré." }, { status: 503 });
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (signInError) {
    if (signInError.status !== 400 && signInError.status !== 401) {
      console.error("Supabase administrator authentication failed.", signInError.code);
      return NextResponse.json({ error: "Le service de connexion est temporairement indisponible." }, { status: 503 });
    }
    return NextResponse.json({ error: "Adresse électronique ou mot de passe incorrect." }, { status: 401 });
  }

  let admin;
  try {
    admin = await getAdminContext();
  } catch (error) {
    console.error("Unable to verify administrator authorization after sign-in.", error);
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Impossible de vérifier les autorisations du compte." }, { status: 503 });
  }
  if (!admin) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Ce compte n’a pas accès à l’administration." }, { status: 403 });
  }
  if (!admin.permissions.size) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Aucune autorisation n’est attribuée à ce compte." }, { status: 403 });
  }

  try {
    await logAdminAudit({ action: "admin.login", entityType: "auth", metadata: { method: "password" } });
  } catch (error) {
    console.error("Administrator login could not be audited.", error);
    await supabase.auth.signOut();
    return NextResponse.json({ error: "La connexion est suspendue car le journal d’audit est indisponible." }, { status: 503 });
  }

  return NextResponse.json({ redirectTo: getSafeAdminRedirect(parsed.data.next) });
}
