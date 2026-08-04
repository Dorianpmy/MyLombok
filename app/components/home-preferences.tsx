"use client";

import { useEffect, useState } from "react";
import { PrayerCard } from "./prayer-card";

export function HomePreferences() {
  const [muslimMode, setMuslimMode] = useState(false);

  useEffect(() => {
    const sync = () => setMuslimMode(localStorage.getItem("my-lombok-muslim-mode") === "true");
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return muslimMode ? <div className="site-container home-preferences"><PrayerCard /></div> : null;
}
