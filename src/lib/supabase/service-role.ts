import "server-only";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/types/database";
import { SupabaseConfigurationError } from "./config";

export function createSupabaseServiceRoleClient() {
  const config = z.object({ url: z.url(), key: z.string().min(1) }).safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  if (!config.success) {
    throw new SupabaseConfigurationError("Le serveur Supabase n’est pas entièrement configuré. Vérifiez l’URL et la clé secrète serveur.");
  }
  return createClient<Database>(config.data.url, config.data.key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
