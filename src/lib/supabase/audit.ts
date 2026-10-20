import "server-only";

import { z } from "zod";
import { createSupabaseServerClient } from "./server";

const auditEventSchema = z.object({
  action: z.string().trim().min(2).max(100),
  entityType: z.string().trim().min(2).max(80),
  entityId: z.uuid().optional(),
  metadata: z.record(z.string(), z.union([z.string().max(200), z.number(), z.boolean(), z.null()]))
    .refine((value) => Object.keys(value).every((key) => !/(password|secret|token|cookie|authorization|credential)/i.test(key)),
      "Les données sensibles ne peuvent pas être journalisées."),
});

export async function logAdminAudit(input: z.input<typeof auditEventSchema>) {
  const event = auditEventSchema.parse(input);
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Un administrateur authentifié est requis pour journaliser cette opération.");

  const { error } = await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action: event.action,
    entity_type: event.entityType,
    entity_id: event.entityId ?? null,
    metadata: event.metadata,
  });
  if (error) {
    console.error("Unable to write an administrative audit event.", error.code);
    throw new Error("Impossible d’enregistrer le journal d’audit.");
  }
}
