"use client";

import { useEffect, useRef } from "react";
import { LocateFixed } from "lucide-react";
import type { Place } from "../data/places";

export type PlaceWithDistance = Place & { distance: number };

type UserPosition = { lat: number; lng: number };
type LeafletModule = typeof import("leaflet");

function tileUrl() {
  const dark = document.documentElement.dataset.theme === "dark";
  return `https://{s}.basemaps.cartocdn.com/${dark ? "dark_all" : "light_all"}/{z}/{x}/{y}{r}.png`;
}

function renderMarkers(
  L: LeafletModule,
  layer: import("leaflet").LayerGroup,
  items: PlaceWithDistance[],
  onSelect: (place: PlaceWithDistance) => void,
) {
  layer.clearLayers();
  items.forEach((place) => {
    const icon = L.divIcon({
      className: "map-pin-wrap",
      html: `<span class="map-pin map-pin--${place.category}"><i></i></span>`,
      iconSize: [34, 42],
      iconAnchor: [17, 38],
    });
    L.marker([place.lat, place.lng], { icon, title: place.name }).addTo(layer).on("click", () => onSelect(place));
  });
}

function viewportSignature(items: PlaceWithDistance[]) {
  return items.map(({ id, lat, lng }) => `${id}:${lat}:${lng}`).sort().join("|");
}

function fitMapToItems(L: LeafletModule, map: import("leaflet").Map, items: PlaceWithDistance[]) {
  if (items.length > 1) {
    const points = items.slice(0, 120).map((place) => L.latLng(place.lat, place.lng));
    map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 11, animate: false });
  } else if (items[0]) {
    map.setView([items[0].lat, items[0].lng], 12, { animate: false });
  } else {
    map.setView([-8.58, 116.28], 9, { animate: false });
  }
}

export function ExplorerMap({ items, onSelect, userPosition }: { items: PlaceWithDistance[]; onSelect: (place: PlaceWithDistance) => void; userPosition: UserPosition | null }) {
  const node = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const userMarkerRef = useRef<import("leaflet").CircleMarker | null>(null);
  const tileLayerRef = useRef<import("leaflet").TileLayer | null>(null);
  const itemsRef = useRef(items);
  const onSelectRef = useRef(onSelect);
  const positionRef = useRef(userPosition);
  const viewportSignatureRef = useRef(viewportSignature(items));

  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    let disposed = false;
    let map: import("leaflet").Map | undefined;
    let themeObserver: MutationObserver | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let resizeFrame: number | undefined;
    let initialInvalidateTimer: number | undefined;
    (async () => {
      const L = await import("leaflet");
      if (disposed || !node.current) return;
      const bounds: import("leaflet").LatLngBoundsExpression = [[-9.18, 115.72], [-8.12, 116.86]];
      map = L.map(node.current, { center: [-8.58, 116.28], zoom: 9, minZoom: 8, maxZoom: 17, maxBounds: bounds, maxBoundsViscosity: 1, zoomControl: false, attributionControl: true });
      mapRef.current = map;
      tileLayerRef.current = L.tileLayer(tileUrl(), { maxZoom: 19, attribution: "© OpenStreetMap · CARTO" }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      markerLayerRef.current = L.layerGroup().addTo(map);
      renderMarkers(L, markerLayerRef.current, itemsRef.current, (place) => onSelectRef.current(place));
      viewportSignatureRef.current = viewportSignature(itemsRef.current);
      fitMapToItems(L, map, itemsRef.current);
      if (positionRef.current) {
        userMarkerRef.current = L.circleMarker([positionRef.current.lat, positionRef.current.lng], { className: "map-user-marker", radius: 9, color: "#fcfaf6", weight: 3, fillColor: "#b28a52", fillOpacity: 1 }).addTo(map).bindTooltip("Votre position");
      }
      themeObserver = new MutationObserver(() => tileLayerRef.current?.setUrl(tileUrl()));
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(() => {
          if (resizeFrame !== undefined) window.cancelAnimationFrame(resizeFrame);
          resizeFrame = window.requestAnimationFrame(() => map?.invalidateSize({ animate: false, pan: false }));
        });
        resizeObserver.observe(node.current);
      }
      initialInvalidateTimer = window.setTimeout(() => map?.invalidateSize({ animate: false, pan: false }), 80);
    })();
    return () => {
      disposed = true;
      themeObserver?.disconnect();
      resizeObserver?.disconnect();
      if (resizeFrame !== undefined) window.cancelAnimationFrame(resizeFrame);
      if (initialInvalidateTimer !== undefined) window.clearTimeout(initialInvalidateTimer);
      mapRef.current = null;
      markerLayerRef.current = null;
      userMarkerRef.current = null;
      tileLayerRef.current = null;
      map?.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;
    let active = true;
    void import("leaflet").then((L) => {
      if (!active) return;
      renderMarkers(L, layer, items, (place) => onSelectRef.current(place));
      map.invalidateSize({ animate: false, pan: false });
      const nextSignature = viewportSignature(items);
      if (nextSignature !== viewportSignatureRef.current) {
        viewportSignatureRef.current = nextSignature;
        fitMapToItems(L, map, items);
      }
    });
    return () => { active = false; };
  }, [items]);

  useEffect(() => {
    positionRef.current = userPosition;
    const map = mapRef.current;
    if (!map) return;
    let active = true;
    void import("leaflet").then((L) => {
      if (!active) return;
      userMarkerRef.current?.remove();
      userMarkerRef.current = userPosition
        ? L.circleMarker([userPosition.lat, userPosition.lng], { className: "map-user-marker", radius: 9, color: "#fcfaf6", weight: 3, fillColor: "#b28a52", fillOpacity: 1 }).addTo(map).bindTooltip("Votre position")
        : null;
    });
    return () => { active = false; };
  }, [userPosition]);

  function recenter() {
    const target = userPosition || { lat: -8.8947, lng: 116.2832 };
    mapRef.current?.flyTo([target.lat, target.lng], userPosition ? 13 : 11, { duration: 1.1 });
  }

  return <div className="explorer-map-shell"><div className="explorer-map" ref={node} aria-label="Carte de Lombok et des îles voisines" /><button type="button" className="explorer-map-recenter" onClick={recenter} aria-label={userPosition ? "Recentrer la carte sur ma position" : "Recentrer la carte sur Kuta Lombok"}><LocateFixed aria-hidden="true" /></button></div>;
}
