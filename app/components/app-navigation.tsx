"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, Map, Route, UserRound } from "lucide-react";
import { useActiveDestination } from "../lib/use-active-destination";

export function AppNavigation() {
  const pathname = usePathname();
  const { destinationId } = useActiveDestination();
  const explorerHref = destinationId === "lombok" ? "/explorer" : `/destination/${destinationId}/activities`;
  const items = [
    { href: explorerHref, label: "Explorer", Icon: Compass, current: pathname === "/explorer" || pathname === `/destination/${destinationId}` || pathname.includes("/activities") },
    { href: `/destination/${destinationId}/map`, label: "Carte", Icon: Map, current: pathname.includes("/map") },
    { href: `/trip?destination=${destinationId}`, label: "Voyage", Icon: Route, current: pathname === "/trip" },
    { href: "/saved", label: "Favoris", Icon: Heart, current: pathname === "/saved" },
    { href: "/profil", label: "Profil", Icon: UserRound, current: pathname.startsWith("/profil") },
  ];
  return (
    <nav className="app-navigation" aria-label="Navigation de l’application">
      {items.map(({ href, label, Icon, current }) => {
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
