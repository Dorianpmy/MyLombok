"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, MapPin, X } from "lucide-react";
import { useCallback, useState } from "react";
import { destinations } from "../data/destinations";
import type { DestinationId } from "../data/destination-types";
import {
  ACTIVE_DESTINATION_KEY,
  destinationRouteForPath,
  useActiveDestination,
} from "../lib/use-active-destination";
import { useDialogA11y } from "./use-dialog-a11y";

export function DestinationSwitcher() {
  const { destinationId, pathname } = useActiveDestination();
  const current = destinations.find((destination) => destination.id === destinationId) ?? destinations[0];
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const close = useCallback(() => setOpen(false), []);
  const dialogRef = useDialogA11y<HTMLDivElement>(open, close);

  function choose(nextDestinationId: DestinationId) {
    try { localStorage.setItem(ACTIVE_DESTINATION_KEY, nextDestinationId); } catch { /* La navigation fonctionne sans stockage. */ }
    setOpen(false);
    router.push(destinationRouteForPath(pathname, nextDestinationId));
  }

  return (
    <>
      <button className="destination-switcher__trigger" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        <MapPin aria-hidden="true" />
        <span><small>Destination</small>{current.shortName}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {open && (
        <div className="destination-switcher__backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div ref={dialogRef} className="destination-switcher__sheet" role="dialog" aria-modal="true" aria-labelledby="destination-switcher-title">
            <div className="destination-switcher__heading">
              <div><span className="eyebrow">MyLombok en voyage</span><h2 id="destination-switcher-title">Choisir une destination</h2></div>
              <button type="button" className="dialog-close" onClick={close} aria-label="Fermer le choix de destination"><X aria-hidden="true" /></button>
            </div>
            <div className="destination-switcher__list">
              {destinations.map((destination) => (
                <button key={destination.id} type="button" className={destination.id === current.id ? "is-current" : ""} onClick={() => choose(destination.id)}>
                  <span className="destination-switcher__image"><Image src={destination.heroImage} alt="" fill sizes="(max-width: 640px) 88px, 120px" /></span>
                  <span className="destination-switcher__copy"><strong>{destination.name}</strong><small>{destination.country}</small><span>{destination.description}</span></span>
                  {destination.id === current.id && <Check aria-label="Destination active" />}
                </button>
              ))}
            </div>
            <p className="destination-switcher__note">Lombok reste le cœur de MyLombok. Les services proposés s’adaptent à la destination choisie.</p>
          </div>
        </div>
      )}
    </>
  );
}
