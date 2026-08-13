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
    try {
      localStorage.setItem(ACTIVE_DESTINATION_KEY, nextDestinationId);
    } catch {
      /* ignore */
    }
    setOpen(false);
    document.body.style.overflow = "";
    router.push(destinationRouteForPath(pathname, nextDestinationId));
  }

  return (
    <>
      <button
        className="destination-switcher__trigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Destination : ${current.shortName}. Changer`}
      >
        <MapPin aria-hidden="true" />
        <span>
          <small>Destination</small>
          {current.shortName}
        </span>
        <ChevronDown aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="destination-switcher__backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            className="destination-switcher__sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-switcher-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="destination-switcher__heading">
              <div>
                <span className="eyebrow">Changer de destination</span>
                <h2 id="destination-switcher-title">Où veux-tu aller ?</h2>
              </div>
              <button type="button" className="dialog-close" onClick={close} aria-label="Fermer">
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="destination-switcher__list">
              {destinations.map((destination) => {
                const selected = destination.id === current.id;
                return (
                  <button
                    key={destination.id}
                    type="button"
                    className={selected ? "is-current" : ""}
                    onClick={() => choose(destination.id)}
                  >
                    <span className="destination-switcher__thumb">
                      {destination.heroImage ? (
                        <Image
                          src={destination.heroImage}
                          alt=""
                          fill
                          sizes="80px"
                          style={{ objectFit: "cover" }}
                        />
                      ) : null}
                    </span>
                    <span className="destination-switcher__meta">
                      <strong>{destination.name}</strong>
                      <small>{destination.country}</small>
                    </span>
                    {selected ? <Check aria-hidden="true" /> : <span aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
