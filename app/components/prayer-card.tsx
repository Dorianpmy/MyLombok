"use client";

import { useEffect, useMemo, useState } from "react";
import { MoonStar } from "lucide-react";
import { nextPrayer } from "../lib/prayer-times";

export function PrayerCard() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const prayer = useMemo(() => nextPrayer(now), [now]);
  const progress = Math.max(4, Math.min(100, 100 - prayer.msLeft / (6 * 60 * 60 * 1000) * 100));
  return (
    <section className="prayer-card" aria-label={`Prochaine prière : ${prayer.name} à ${prayer.label}`}>
      <span className="prayer-card__icon"><MoonStar aria-hidden="true" /></span>
      <div>
        <small>Prochaine prière · heure WITA</small>
        <strong>{prayer.name} à {prayer.label}</strong>
        <p><b>{prayer.countdown}</b> avant la prochaine prière</p>
      </div>
      <span className="prayer-card__progress" aria-hidden="true" style={{ "--prayer-progress": `${progress}%` } as React.CSSProperties} />
    </section>
  );
}
