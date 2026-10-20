import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  password: z.string().min(1).max(256),
  next: z.string().optional(),
});

export const adminPasswordSchema = z.object({
  password: z.string().min(12).max(256)
    .refine((password) => /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password),
      "Le mot de passe doit contenir une minuscule, une majuscule et un chiffre."),
});

export function getSafeAdminRedirect(candidate: string | undefined) {
  if (!candidate || !candidate.startsWith("/admin") || candidate.startsWith("//") || candidate.includes("\\")) return "/admin";
  return candidate;
}
