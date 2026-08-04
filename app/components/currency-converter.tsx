"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";

const fallbackRates: Record<string, number> = { EUR: 0.000052, USD: 0.000061, GBP: 0.000045, CHF: 0.000049, AUD: 0.000094, SGD: 0.000079 };

export function CurrencyConverter() {
  const [amount, setAmount] = useState(1_000_000);
  const [currency, setCurrency] = useState("EUR");
  const [rate, setRate] = useState(fallbackRates.EUR);
  const [source, setSource] = useState("taux indicatif hors ligne");

  useEffect(() => {
    let active = true;
    async function refreshRate() {
      await Promise.resolve();
      if (!active) return;
      setRate(fallbackRates[currency]);
      setSource("taux indicatif hors ligne");
      const cached = localStorage.getItem(`my-lombok-rate-${currency}`);
      if (cached) {
        try {
          const value = JSON.parse(cached) as { rate: number; date: string; savedAt: number };
          if (Number.isFinite(value.rate)) {
            setRate(value.rate);
            setSource(`taux du ${value.date}`);
            if (Date.now() - value.savedAt < 86_400_000) return;
          }
        } catch { /* Le taux de secours reste disponible. */ }
      }
      try {
        const response = await fetch(`https://api.frankfurter.dev/v2/rate/IDR/${currency}`);
        if (!response.ok) throw new Error(String(response.status));
        const data = await response.json() as { rate: number; date: string };
        if (!active || !Number.isFinite(data.rate)) return;
        setRate(data.rate);
        setSource(`taux du ${data.date}`);
        localStorage.setItem(`my-lombok-rate-${currency}`, JSON.stringify({ rate: data.rate, date: data.date, savedAt: Date.now() }));
      } catch {
        // Le taux de secours reste affiché si la connexion est indisponible.
      }
    }
    void refreshRate();
    return () => { active = false; };
  }, [currency]);

  const converted = amount * rate;
  return (
    <section className="currency-tool" aria-labelledby="currency-title">
      <div className="currency-tool__heading"><div><span className="eyebrow">Outil pratique</span><h2 id="currency-title">Convertisseur de roupies</h2></div><small>{source}</small></div>
      <div className="currency-tool__fields">
        <label>Roupies indonésiennes<input type="number" min="0" step="10000" value={amount} onChange={(event) => setAmount(Math.max(0, Number(event.target.value)))} /></label>
        <ArrowLeftRight aria-hidden="true" />
        <label>Devise<select value={currency} onChange={(event) => setCurrency(event.target.value)}>{Object.keys(fallbackRates).map((code) => <option key={code}>{code}</option>)}</select><output>{new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 2 }).format(converted)}</output></label>
      </div>
      <p>Le taux est informatif. Le montant débité peut varier selon votre banque ou le bureau de change.</p>
    </section>
  );
}
