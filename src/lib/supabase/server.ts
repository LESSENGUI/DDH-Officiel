import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "./config";
import type { Database } from "@/types/database";

export async function createSupabaseServerClient() {
  const { url, key } = getSupabasePublicConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch (error) {
          console.error("Unable to persist Supabase auth cookies in this request context.", error);
        }
      },
    },
  });
}
