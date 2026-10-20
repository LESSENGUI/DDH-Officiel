import { describe, expect, it } from "vitest";
import { contactMessageSchema } from "../../../lib/validation/contact";

describe("contact input constraints", () => {
  it("accepts a consented message with valid fields", () => {
    expect(contactMessageSchema.safeParse({ category: "Partenariat", name: "Visiteur", email: "visiteur@example.org", subject: "Demande", body: "Bonjour, voici ma demande.", consent: "true" }).success).toBe(true);
  });

  it("rejects invalid addresses, short messages, and missing consent", () => {
    expect(contactMessageSchema.safeParse({ category: "x", name: "V", email: "nope", subject: "x", body: "court", consent: "false" }).success).toBe(false);
  });
});
