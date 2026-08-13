"use client";

import Link from "next/link";
import { ExternalLink, LocateFixed, MapPin, Navigation, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Destination, TravelPlace, TravelPlaceCategory } from "../data/destination-types";

type LeafletModule = typeof import("leaflet");
type LeafletMap = import("leaflet").Map;
type LeafletLayerGroup = import("leaflet").LayerGroup;
type LeafletCircleMarker = import("leaflet").CircleMarker;

type Coordinates = { latitude: number; longitude: number };

type DestinationMapProps = {
  destination: Destination;
  places: readonly TravelPlace[];
  selectedId?: string | null;
  onSelect: (place: TravelPlace) => void;
  onClearSelection?: () => void;
};

const categoryColors: Record<TravelPlaceCategory, string> = {
  attraction: "#8b6b3f",
  family: "#587c72",
  food: "#9a5f48",
  market: "#8d7445",
  mosque: "#456f68",
  culture: "#7b6348",
  shopping: "#6e6280",
  park: "#4f7658",
  viewpoint: "#577780",
  neighborhood: "#7b6a59",
  practical: "#526773",
  transport: "#536b85",
};

function clusterPlaces(map: LeafletMap, places: readonly TravelPlace[]) {
  const cells = new Map<string, TravelPlace[]>();
  const cellSize = map.getZoom() >= 15 ? 34 : map.getZoom() >= 12 ? 46 : 58;

  for (const place of places) {
    const point = map.latLngToContainerPoint([place.coordinates.latitude, place.coordinates.longitude]);
    const key = `${Math.floor(point.x / cellSize)}:${Math.floor(point.y / cellSize)}`;
    const cell = cells.get(key);
    if (cell) cell.push(place);
    else cells.set(key, [place]);
  }

  return [...cells.values()];
}

function markerCoordinates(group: readonly TravelPlace[]): Coordinates {
  return {
    latitude: group.reduce((sum, place) => sum + place.coordinates.latitude, 0) / group.length,
    longitude: group.reduce((sum, place) => sum + place.coordinates.longitude, 0) / group.length,
  };
}

export function DestinationMap({ destination, places, selectedId = null, onSelect, onClearSelection }: DestinationMapProps) {
  const mapNode = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const markerLayerRef = useRef<LeafletLayerGroup | null>(null);
  const userMarkerRef = useRef<LeafletCircleMarker | null>(null);
  const placesRef = useRef(places);
  const onSelectRef = useRef(onSelect);
  const [mapReady, setMapReady] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "ready" | "denied">("idle");
  const selectedPlace = useMemo(() => places.find((place) => place.id === selectedId) ?? null, [places, selectedId]);

  useEffect(() => { placesRef.current = places; }, [places]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  const renderMarkers = useCallback(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();

    for (const group of clusterPlaces(map, placesRef.current)) {
      const center = markerCoordinates(group);
      const single = group.length === 1 ? group[0] : null;
      const color = single ? categoryColors[single.category] : "#1f4d40";
      const label = single ? single.name : `${group.length} lieux proches`;
      const icon = L.divIcon({
        className: "destination-map__marker-shell",
        html: `<span class="destination-map__marker destination-map__marker--${single?.category ?? "cluster"}" style="--destination-marker-color:${color}"><i></i>${single ? "" : `<b>${group.length}</b>`}</span>`,
        iconSize: [38, 44],
        iconAnchor: [19, 42],
      });
      const marker = L.marker([center.latitude, center.longitude], { icon, title: label, keyboard: true }).addTo(layer);
      marker.on("click", () => {
        if (single) onSelectRef.current(single);
        else if (map.getZoom() < 17) map.flyToBounds(L.latLngBounds(group.map((place) => [place.coordinates.latitude, place.coordinates.longitude])), { padding: [42, 42], maxZoom: 17, duration: 0.55 });
        else onSelectRef.current(group[0]);
      });
      marker.on("add", () => {
        const element = marker.getElement();
        if (!element) return;
        element.setAttribute("role", "button");
        element.setAttribute("aria-label", label);
      });
    }
  }, []);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;
    let active = true;
    let resizeObserver: ResizeObserver | null = null;

    void import("leaflet").then((module) => {
      if (!active || !mapNode.current) return;
      const L = module.default ?? module;
      leafletRef.current = L;
      const map = L.map(mapNode.current, {
        center: [destination.coordinates.latitude, destination.coordinates.longitude],
        zoom: destination.defaultZoom,
        minZoom: Math.max(3, destination.defaultZoom - 4),
        maxZoom: 19,
        maxBounds: destination.bounds,
        maxBoundsViscosity: 0.75,
        zoomControl: true,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      }).addTo(map);
      markerLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      map.on("zoomend moveend", renderMarkers);
      renderMarkers();
      resizeObserver = new ResizeObserver(() => map.invalidateSize({ pan: false }));
      resizeObserver.observe(mapNode.current);
      setMapReady(true);
    });

    return () => {
      active = false;
      resizeObserver?.disconnect();
      mapRef.current?.off("zoomend moveend", renderMarkers);
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      leafletRef.current = null;
    };
  }, [destination, renderMarkers]);

  useEffect(() => {
    if (!mapReady) return;
    renderMarkers();
  }, [mapReady, places, renderMarkers]);

  useEffect(() => {
    if (!selectedPlace || !mapRef.current) return;
    mapRef.current.flyTo([selectedPlace.coordinates.latitude, selectedPlace.coordinates.longitude], Math.max(mapRef.current.getZoom(), 14), { duration: 0.55 });
  }, [selectedPlace]);

  function requestLocation() {
    if (!navigator.geolocation) { setLocationStatus("denied"); return; }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const L = leafletRef.current;
      const map = mapRef.current;
      if (!L || !map) return;
      userMarkerRef.current?.remove();
      userMarkerRef.current = L.circleMarker([coords.latitude, coords.longitude], {
        radius: 8,
        color: "#fffaf1",
        weight: 3,
        fillColor: "#2c7d71",
        fillOpacity: 1,
      }).addTo(map).bindTooltip("Votre position");
      map.flyTo([coords.latitude, coords.longitude], Math.max(map.getZoom(), 14), { duration: 0.65 });
      setLocationStatus("ready");
    }, () => setLocationStatus("denied"), { enableHighAccuracy: true, timeout: 9000, maximumAge: 300000 });
  }

  return (
    <section className="destination-map" aria-label={`Carte de ${destination.name}`}>
      <div className="destination-map__canvas-shell">
        <div className="destination-map__canvas" ref={mapNode} aria-label={`Carte interactive de ${destination.name}`} />
        {!mapReady && <div className="destination-map__loading" role="status">La carte se prépare…</div>}
        <button className="destination-map__locate" type="button" onClick={requestLocation} disabled={locationStatus === "loading"}>
          <LocateFixed aria-hidden="true" />
          {locationStatus === "loading" ? "Localisation…" : locationStatus === "denied" ? "Réessayer ma position" : locationStatus === "ready" ? "Recentrer sur moi" : "Utiliser ma position"}
        </button>
      </div>

      <aside className="destination-map__list" aria-label="Alternative en liste à la carte">
        <h2><MapPin aria-hidden="true" /> Lieux affichés <span>{places.length}</span></h2>
        {places.length ? <ol>{places.map((place) => (
          <li key={place.id}>
            <button className={place.id === selectedId ? "is-selected" : undefined} type="button" onClick={() => onSelect(place)} aria-pressed={place.id === selectedId}>
              <span>{place.name}</span>
              <small>{place.neighborhood || destination.name}</small>
            </button>
          </li>
        ))}</ol> : <p>Aucun lieu ne correspond aux filtres actuels.</p>}
      </aside>

      {selectedPlace && <aside className="destination-map__preview" aria-labelledby="destination-map-preview-title">
        <button type="button" className="destination-map__preview-close" onClick={onClearSelection} aria-label="Fermer l’aperçu"><X aria-hidden="true" /></button>
        <span>{selectedPlace.neighborhood || destination.name}</span>
        <h2 id="destination-map-preview-title">{selectedPlace.name}</h2>
        <p>{selectedPlace.shortDescription}</p>
        <div>
          <Link href={`/activity/${selectedPlace.slug}`}>Voir la fiche <ExternalLink aria-hidden="true" /></Link>
          <a href={selectedPlace.navigationUrl} target="_blank" rel="noopener noreferrer">Itinéraire <Navigation aria-hidden="true" /></a>
        </div>
      </aside>}
    </section>
  );
}

