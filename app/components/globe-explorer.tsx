"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LocateFixed, Map } from "lucide-react";

export function GlobeExplorer({ onOpenMap }: { onOpenMap: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const reset = useRef<(() => void) | null>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, element.clientWidth / Math.max(1, element.clientHeight), 0.1, 100);
    camera.position.set(0, 0.08, 3.25);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(element.clientWidth, element.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    element.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);
    const texture = new THREE.TextureLoader().load("/earth-blue-marble.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 72, 72), new THREE.MeshPhongMaterial({ map: texture, shininess: 7, specular: new THREE.Color(0x32453d) }));
    world.add(earth);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.04, 72, 72), new THREE.MeshBasicMaterial({ color: 0x9fb9aa, transparent: true, opacity: 0.12, side: THREE.BackSide, blending: THREE.AdditiveBlending }));
    world.add(atmosphere);

    const lat = THREE.MathUtils.degToRad(-8.58);
    const lon = THREE.MathUtils.degToRad(116.32);
    const markerPosition = new THREE.Vector3(-Math.cos(lat) * Math.cos(lon + Math.PI), Math.sin(lat), Math.cos(lat) * Math.sin(lon + Math.PI)).multiplyScalar(1.025);
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.035, 20, 20), new THREE.MeshBasicMaterial({ color: 0xb28a52 }));
    marker.position.copy(markerPosition);
    const pulse = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.072, 32), new THREE.MeshBasicMaterial({ color: 0xf6f2e9, transparent: true, opacity: 0.72, side: THREE.DoubleSide }));
    pulse.position.copy(markerPosition).multiplyScalar(1.004);
    pulse.lookAt(markerPosition.clone().multiplyScalar(2));
    world.add(marker, pulse);

    scene.add(new THREE.HemisphereLight(0xf6f2e9, 0x0e1915, 2.2));
    const light = new THREE.DirectionalLight(0xfff4df, 2.8); light.position.set(-3, 2, 4); scene.add(light);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.055; controls.enablePan = false; controls.minDistance = 1.7; controls.maxDistance = 4.6; controls.rotateSpeed = 0.48; controls.zoomSpeed = 0.65;
    const focus = () => { world.rotation.set(-lat * 0.3, Math.atan2(-markerPosition.x, markerPosition.z), 0); camera.position.set(0, 0.08, 3.05); controls.update(); };
    reset.current = focus; focus();
    let frame = 0; let dragging = false;
    controls.addEventListener("start", () => { dragging = true; });
    controls.addEventListener("end", () => { dragging = false; });
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!reduceMotion && !dragging) world.rotation.y += 0.00035;
      if (!reduceMotion) pulse.scale.setScalar(1 + Math.sin(performance.now() * 0.0035) * 0.16);
      controls.update(); renderer.render(scene, camera);
    };
    animate();
    const resize = () => { camera.aspect = element.clientWidth / Math.max(1, element.clientHeight); camera.updateProjectionMatrix(); renderer.setSize(element.clientWidth, element.clientHeight); };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); controls.dispose(); texture.dispose(); renderer.dispose(); element.replaceChildren(); };
  }, []);

  return (
    <section className="globe-explorer" aria-label="Globe 3D interactif centré sur Lombok">
      <div className="globe-explorer__canvas" ref={host} />
      <div className="globe-explorer__caption"><span>Lombok · Indonésie</span><small>Faites glisser pour tourner · pincez pour zoomer</small></div>
      <button className="globe-explorer__reset" onClick={() => reset.current?.()} aria-label="Recentrer le globe sur Lombok"><LocateFixed aria-hidden="true" /></button>
      <button className="button button--light globe-explorer__map" onClick={onOpenMap}><Map aria-hidden="true" /> Voir la carte de Lombok</button>
    </section>
  );
}
