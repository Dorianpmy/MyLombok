"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, X } from "lucide-react";
import { Brand } from "./brand";

const links = [
  { href: "/#services", label: "Nos services" },
  { href: "/explorer", label: "Explorer" },
  { href: "/a-propos", label: "À propos" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <Brand />
        <nav className="desktop-navigation" aria-label="Navigation principale">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <Link className="button button--primary header-cta" href="/conciergerie">
          <MessageCircle aria-hidden="true" />
          Organiser mon séjour
        </Link>
        <button ref={triggerRef} className="mobile-menu-trigger" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <div className={`mobile-menu${open ? " is-open" : ""}`} id="mobile-menu" aria-hidden={!open}>
        <nav className="site-container" aria-label="Navigation mobile">
          {links.map((link) => <Link key={link.href} href={link.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link className="button button--primary" href="/conciergerie" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>Organiser mon séjour</Link>
        </nav>
      </div>
    </header>
  );
}
