import "server-only";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { requirePermission } from "./admin";
import { createSupabaseServerClient } from "./server";

export const mediaUploadSchema = z.object({
  fileName: z.string().trim().min(1).max(180),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"]),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024),
});

const publicImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function createMediaUploadUrl(input: z.output<typeof mediaUploadSchema>) {
  const file = input;
  const admin = await requirePermission("media.upload");
  const supabase = await createSupabaseServerClient();
  const bucket = publicImageTypes.has(file.contentType) ? "ddh-public-media" : "ddh-private-documents";
  const safeExtension = file.fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const objectPath = `${admin.id}/${randomUUID()}.${safeExtension}`;
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(objectPath);
  if (error) {
    console.error("Unable to create a Supabase Storage upload URL.", error.name);
    throw new Error("Impossible de préparer le téléversement du média.");
  }

  const { error: mediaError } = await supabase.from("media").insert({
    bucket_id: bucket,
    object_path: objectPath,
    original_name: file.fileName,
    mime_type: file.contentType,
    size_bytes: file.sizeBytes,
    is_public: bucket === "ddh-public-media",
    status: "draft",
    uploaded_by: admin.id,
    created_by: admin.id,
    updated_by: admin.id,
  });
  if (mediaError) {
    console.error("Unable to create Supabase media metadata.", mediaError.code);
    throw new Error("Impossible d’enregistrer les métadonnées du média.");
  }
  return { bucket, objectPath, token: data.token };
}
