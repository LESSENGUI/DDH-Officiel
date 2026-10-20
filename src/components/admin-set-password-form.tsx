"use client";

import { FormEvent, useState } from "react";

export default function AdminSetPasswordForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const password = new FormData(event.currentTarget).get("password");
    try {
      const response = await fetch("/api/admin/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Impossible de définir le mot de passe.");
        return;
      }
      window.location.assign("/admin");
    } catch (requestError) {
      console.error("Unable to set the administrator password.", requestError);
      setError("Le service est temporairement indisponible.");
    } finally {
      setPending(false);
    }
  }

  return <form className="admin-form" onSubmit={submit}>
    {error && <div className="admin-notice" role="alert">{error}</div>}
    <label>NOUVEAU MOT DE PASSE<input type="password" name="password" autoComplete="new-password" minLength={12} maxLength={256} required /></label>
    <p className="admin-password-hint">12 caractères minimum, avec une majuscule, une minuscule et un chiffre.</p>
    <button className="button button-gold" type="submit" disabled={pending}>{pending ? "Enregistrement…" : "Définir le mot de passe"} <span>↗</span></button>
  </form>;
}
