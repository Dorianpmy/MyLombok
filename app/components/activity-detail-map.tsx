"use client";

import { useState } from "react";
import type { Destination, TravelPlace } from "../data/destination-types";
import { DestinationMap } from "./destination-map";

export function ActivityDetailMap({ destination, place }: { destination: Destination; place: TravelPlace }) {
  const [selectedId, setSelectedId] = useState<string | null>(place.id);
  return (
    <DestinationMap
      destination={destination}
      places={[place]}
      selectedId={selectedId}
      onSelect={() => setSelectedId(place.id)}
      onClearSelection={() => setSelectedId(null)}
    />
  );
}
