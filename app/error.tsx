"use client";

import { RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="state-page"><span className="eyebrow">Un imprévu</span><h1>Cette page n’a pas pu se charger.</h1><p>Vos données locales sont conservées. Vous pouvez relancer la page en toute sécurité.</p><button className="button button--primary" onClick={reset}><RotateCcw aria-hidden="true" /> Réessayer</button></main>;
}
