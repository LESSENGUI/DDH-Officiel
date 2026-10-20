import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { SupabaseConfigurationError } from "@/lib/supabase/config";
import { InMemoryRateLimiter } from "@/lib/rate-limit";
import { contactMessageSchema } from "@/lib/validation/contact";

const contactRateLimiter = new InMemoryRateLimiter(5, 15 * 60 * 1000);

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) return NextResponse.json({ error: "La demande est trop volumineuse." }, { status: 413 });

  const clientIp = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = contactRateLimiter.consume(clientIp);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Trop de demandes. Veuillez réessayer plus tard." }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  }

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: "La requête doit contenir un JSON valide." }, { status: 400 });
  }
  const parsed = contactMessageSchema.safeParse(requestBody);
  if (!parsed.success) return NextResponse.json({ error: "Vérifiez les champs du formulaire." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true }, { status: 201 });

  let supabase;
  try {
    supabase = createSupabaseServiceRoleClient();
  } catch (error) {
    if (!(error instanceof SupabaseConfigurationError)) throw error;
    console.error(error.message);
    return NextResponse.json({ error: "Le service de contact est temporairement indisponible." }, { status: 503 });
  }

  const { error } = await supabase.from("contact_messages").insert({
    category: parsed.data.category,
    name: parsed.data.name,
    organization: parsed.data.organization || null,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    subject: parsed.data.subject,
    body: parsed.data.body,
    consent: true,
  });
  if (error) {
    console.error("Unable to store contact message in Supabase.", error.code);
    return NextResponse.json({ error: "Le service de contact est temporairement indisponible." }, { status: 503 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
