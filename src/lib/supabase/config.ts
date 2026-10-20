import { z } from "zod";

const publicConfigSchema = z.object({
  url: z.url(),
  key: z.string().min(1),
});

export class SupabaseConfigurationError extends Error {
  constructor(message = "Supabase n’est pas configuré. Renseignez les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.") {
    super(message);
    this.name = "SupabaseConfigurationError";
  }
}

export function getSupabasePublicConfig() {
  const config = publicConfigSchema.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  if (!config.success) throw new SupabaseConfigurationError();
  return config.data;
}

export function isSupabasePublicConfigured() {
  return publicConfigSchema.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }).success;
}
