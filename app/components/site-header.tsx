"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "./brand";
import { DestinationSwitcher } from "./destination-switcher";

const links = [
  { href: "/zones", label: "Zones" },
  { href: "/tips", label: "Tips" },
  { href: "/hijrah", label: "Hijrah" },
  { href: "/parcours", label: "Parcours" },
  { href: "/a-propos", label: "À propos" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-header${isHome ? " site-header--home" : ""}${scrolled ? " is-scrolled" : ""}${open ? " menu-open" : ""}`}>
      <div className="site-header__inner site-container">
        <Brand />

        <nav className="desktop-navigation" aria-label="Navigation principale">
          {links.map((link) => {
            const linkPath = link.href.split("#")[0];
            const isCurrent = pathname === linkPath || (linkPath !== "/" && pathname.startsWith(linkPath));
            return (
              <Link key={link.href} href={link.href} aria-current={isCurrent ? "page" : undefined}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <DestinationSwitcher />
          <Link className="button button--primary header-cta" href="/parcours">
            S’installer
          </Link>
          <button
            type="button"
            className="mobile-menu-trigger"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          </button>
        </div>
      </div>

      <div id={menuId} className={`mobile-menu${open ? " is-open" : ""}`} ref={menuRef}>
        <nav className="site-container" aria-label="Navigation mobile">
          {links.map((link) => {
            const linkPath = link.href.split("#")[0];
            const isCurrent = pathname === linkPath || (linkPath !== "/" && pathname.startsWith(linkPath));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent ? "page" : undefined}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <Link className="button button--primary" href="/parcours" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            S’installer
          </Link>
        </nav>
      </div>
      {open ? <button type="button" className="mobile-menu-backdrop" aria-label="Fermer le menu" onClick={() => setOpen(false)} /> : null}
    </header>
  );
}
