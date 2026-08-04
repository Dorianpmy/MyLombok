"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, MessageCircle, UserRound } from "lucide-react";

const items = [
  { href: "/", label: "Accueil", Icon: Home },
  { href: "/explorer", label: "Explorer", Icon: Compass },
  { href: "/conciergerie", label: "Conciergerie", Icon: MessageCircle },
  { href: "/profil", label: "Profil", Icon: UserRound },
];

export function AppNavigation() {
  const pathname = usePathname();
  return (
    <nav className="app-navigation" aria-label="Navigation de l’application">
      {items.map(({ href, label, Icon }) => {
        const current = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={current ? "page" : undefined} className={current ? "is-current" : ""}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
