import { NextResponse } from "next/server";
import { SupabaseConfigurationError } from "@/lib/supabase/config";
import { AdminAuthorizationError } from "@/lib/supabase/admin";
import { createMediaUploadUrl, mediaUploadSchema } from "@/lib/supabase/storage";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4_096) return NextResponse.json({ error: "La demande est trop volumineuse." }, { status: 413 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "La requête doit contenir un JSON valide." }, { status: 400 });
  }
  const parsed = mediaUploadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Les informations du média sont invalides." }, { status: 400 });

  try {
    const upload = await createMediaUploadUrl(parsed.data);
    return NextResponse.json(upload, { status: 201 });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      console.error(error.message);
      return NextResponse.json({ error: "Le stockage média n’est pas configuré." }, { status: 503 });
    }
    if (error instanceof AdminAuthorizationError) {
      return NextResponse.json({ error: "Accès non autorisé à la médiathèque." }, { status: 403 });
    }
    console.error("Unable to create an authorized media upload.", error);
    return NextResponse.json({ error: "Impossible de préparer le téléversement." }, { status: 503 });
  }
}
