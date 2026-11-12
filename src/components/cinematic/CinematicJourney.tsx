"use client";
import CinematicHero from "./CinematicHero";
import SceneDiscovery from "./SceneDiscovery";
import SceneFinale from "./SceneFinale";

export default function CinematicJourney() {
  return (
    <div className="overflow-x-clip bg-matte text-ivory">
      <CinematicHero />
      <SceneDiscovery />
      <SceneFinale />
    </div>
  );
}
