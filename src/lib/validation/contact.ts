import { z } from "zod";

export const contactMessageSchema = z.object({
  category: z.string().trim().min(2).max(80),
  name: z.string().trim().min(2).max(120),
  organization: z.string().trim().max(160).optional().default(""),
  email: z.email().max(254),
  phone: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().min(2).max(180),
  body: z.string().trim().min(10).max(5000),
  consent: z.literal("true"),
  website: z.string().optional().default(""),
});

export type ContactMessageInput = z.output<typeof contactMessageSchema>;
