"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function logout() {
    setError("");
    const response = await fetch("/api/admin/logout", { method: "POST" });
    if (!response.ok) {
      setError("La déconnexion a échoué. Veuillez réessayer.");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return <div className="admin-logout-wrap">
    {error && <span className="admin-logout-error" role="alert">{error}</span>}
    <button className="admin-logout" type="button" onClick={logout}>Déconnexion</button>
  </div>;
}
