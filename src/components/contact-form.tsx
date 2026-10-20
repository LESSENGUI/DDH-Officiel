"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Unable to send message");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }
  return <form className="contact-form" onSubmit={submit}>
    <label>CATÉGORIE DE DEMANDE<select name="category" required defaultValue=""><option value="" disabled>Choisir une catégorie</option><option>Demande institutionnelle</option><option>Presse & interview</option><option>Invitation & conférence</option><option>Partenariat</option><option>Demande professionnelle</option><option>Publications & ouvrages</option><option>Autre demande</option></select></label>
    <label>NOM ET PRÉNOM<input name="name" autoComplete="name" required maxLength={120} /></label>
    <label>ORGANISATION, SI APPLICABLE<input name="organization" autoComplete="organization" maxLength={160} /></label>
    <label>ADRESSE ÉLECTRONIQUE<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    <label>TÉLÉPHONE, FACULTATIF<input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
    <label className="full">OBJET<input name="subject" required maxLength={180} /></label>
    <label className="full">MESSAGE<textarea name="body" required maxLength={5000} /></label>
    <label className="consent full"><input type="checkbox" name="consent" value="true" required />J’accepte que mes informations soient utilisées pour répondre à cette demande.</label>
    <input name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
    {status === "sent" && <p className="form-message full" role="status">Votre message a bien été transmis. Merci de votre prise de contact.</p>}
    {status === "error" && <p className="form-message form-error full" role="alert">L’envoi est momentanément indisponible. Veuillez réessayer plus tard.</p>}
    <button className="button button-gold full" type="submit" disabled={status === "sending"}>{status === "sending" ? "Envoi en cours…" : "Envoyer le message"}<span>↗</span></button>
  </form>;
}
