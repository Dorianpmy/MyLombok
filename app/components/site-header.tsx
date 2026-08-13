"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, X } from "lucide-react";
import { Brand } from "./brand";
import { DestinationSwitcher } from "./destination-switcher";

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/services", label: "Nos services" },
  { href: "/explorer", label: "Explorer" },
  { href: "/a-propos", label: "À propos" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.requestAnimationFrame(() => triggerRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;
      const links = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") || []);
      if (!links.length) return;
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === triggerRef.current) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!isHome) {
      const timer = window.setTimeout(() => setScrolled(false), 0);
      return () => window.clearTimeout(timer);
    }
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isHome]);

  const headerClassName = [
    "site-header",
    isHome ? "site-header--home" : "",
    scrolled ? "is-scrolled" : "",
    open ? "menu-open" : "",
  ].filter(Boolean).join(" ");

  return (
    <header className={headerClassName}>
      <div className="site-container site-header__inner">
        <Brand />
        <nav className="desktop-navigation" aria-label="Navigation principale">
          {links.map((link) => {
            const linkPath = link.href.split("#")[0];
            const isCurrent = linkPath !== "/" && pathname === linkPath;
            return <Link key={link.href} href={link.href} aria-current={isCurrent ? "page" : undefined}>{link.label}</Link>;
          })}
        </nav>
        <div className="site-header__destination"><DestinationSwitcher /></div>
        <Link className="button button--primary header-cta" href="/conciergerie">
          <MessageCircle aria-hidden="true" />
          Organiser mon séjour
        </Link>
        <button ref={triggerRef} className="mobile-menu-trigger" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <div ref={menuRef} className={`mobile-menu${open ? " is-open" : ""}`} id="mobile-menu" aria-hidden={!open}>
        <nav className="site-container" aria-label="Navigation mobile">
          {links.map((link) => {
            const linkPath = link.href.split("#")[0];
            const isCurrent = linkPath !== "/" && pathname === linkPath;
            return <Link key={link.href} href={link.href} aria-current={isCurrent ? "page" : undefined} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>{link.label}</Link>;
          })}
          <Link className="button button--primary" href="/conciergerie" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>Organiser mon séjour</Link>
        </nav>
      </div>
      {open && <button className="mobile-menu-backdrop" type="button" tabIndex={-1} aria-label="Fermer le menu" onClick={() => { setOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()); }} />}
    </header>
  );
}
