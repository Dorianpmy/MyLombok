"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_DESTINATION_ID,
  isDestinationId,
} from "../data/destinations";
import type { DestinationId } from "../data/destination-types";

export const ACTIVE_DESTINATION_KEY = "my-lombok-active-destination";

export function destinationFromPathname(pathname: string): DestinationId | null {
  const destination = pathname.match(/^\/destination\/([^/]+)/)?.[1];
  if (destination && isDestinationId(destination)) return destination;
  if (pathname === "/explorer" || pathname.startsWith("/services") || pathname === "/installer") return "lombok";
  return null;
}

export function destinationRouteForPath(pathname: string, destinationId: DestinationId) {
  if (pathname.includes("/map")) return `/destination/${destinationId}/map`;
  if (pathname.includes("/activities") || pathname === "/explorer") {
    return destinationId === "lombok" ? "/explorer" : `/destination/${destinationId}/activities`;
  }
  return `/destination/${destinationId}`;
}

export function useActiveDestination() {
  const pathname = usePathname();
  const pathDestination = useMemo(() => destinationFromPathname(pathname), [pathname]);
  const [destinationId, setDestinationId] = useState<DestinationId>(pathDestination ?? DEFAULT_DESTINATION_ID);

  useEffect(() => {
    if (pathDestination) {
      setDestinationId(pathDestination);
      try { localStorage.setItem(ACTIVE_DESTINATION_KEY, pathDestination); } catch { /* Le choix de route reste prioritaire. */ }
      return;
    }
    try {
      const stored = localStorage.getItem(ACTIVE_DESTINATION_KEY);
      if (stored && isDestinationId(stored)) setDestinationId(stored);
    } catch {
      setDestinationId(DEFAULT_DESTINATION_ID);
    }
  }, [pathDestination]);

  return { destinationId, pathname };
}
