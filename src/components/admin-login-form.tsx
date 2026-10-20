"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          next: nextPath,
        }),
      });
      const result = await response.json() as { error?: string; redirectTo?: string };
      if (!response.ok) {
        setError(result.error ?? "Connexion impossible. Veuillez réessayer.");
        return;
      }
      window.location.assign(result.redirectTo ?? "/admin");
    } catch (requestError) {
      console.error("Unable to submit the administrator login request.", requestError);
      setError("Le service de connexion est temporairement indisponible.");
    } finally {
      setPending(false);
    }
  }

  return <form className="admin-form" onSubmit={submit}>
    {error && <div className="admin-notice" role="alert">{error}</div>}
    <label>ADRESSE ÉLECTRONIQUE<input type="email" name="email" autoComplete="username" required maxLength={254} /></label>
    <label>MOT DE PASSE<input type="password" name="password" autoComplete="current-password" required maxLength={256} /></label>
    <button className="button button-gold" type="submit" disabled={pending}>{pending ? "Connexion…" : "Se connecter"} <span>↗</span></button>
  </form>;
}
