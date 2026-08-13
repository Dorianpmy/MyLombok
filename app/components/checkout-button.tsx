"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  product?: "app_access";
  label?: string;
  className?: string;
};

export function CheckoutButton({ product = "app_access", label = "Payer 69 €", className }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Paiement indisponible pour le moment.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Connexion impossible. Réessaie dans un instant.");
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button type="button" className={className || "button button--primary"} onClick={startCheckout} disabled={loading}>
        {loading ? (
          <>
            <Loader2 aria-hidden="true" className="animate-spin" style={{ width: 18, height: 18 }} />
            Redirection…
          </>
        ) : (
          label
        )}
      </button>
      {error ? (
        <p style={{ margin: 0, fontSize: 13, color: "var(--danger-text)" }} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
