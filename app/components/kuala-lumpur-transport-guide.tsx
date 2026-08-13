import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Baby,
  CarFront,
  ExternalLink,
  Footprints,
  Plane,
  Route,
  TrainFront,
} from "lucide-react";
import {
  kualaLumpurTransportGuide,
  type KualaLumpurTransportMode,
} from "../data/kuala-lumpur-transport";

const modeIcons: Record<KualaLumpurTransportMode, LucideIcon> = {
  walk: Footprints,
  mrt: TrainFront,
  lrt: TrainFront,
  monorail: Route,
  taxi: CarFront,
  airport: Plane,
  baby: Baby,
};

export function KualaLumpurTransportGuide({ compact = false }: { compact?: boolean }) {
  const entries = compact
    ? kualaLumpurTransportGuide.filter(({ id }) => ["walk", "mrt", "airport", "baby"].includes(id))
    : kualaLumpurTransportGuide;

  return (
    <section className={`kl-transport-guide${compact ? " kl-transport-guide--compact" : ""}`} aria-labelledby="kl-transport-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Se déplacer à Kuala Lumpur</span>
          <h2 id="kl-transport-title">Le bon mode, au bon moment.</h2>
        </div>
        <p>Des repères prudents et sourcés. Horaires, tarifs, perturbations et accessibilité restent à vérifier chez l’opérateur le jour du trajet.</p>
      </div>

      <div className="kl-transport-guide__grid">
        {entries.map((entry) => {
          const Icon = modeIcons[entry.id];
          return (
            <article className="kl-transport-guide__card" key={entry.id}>
              <span className="kl-transport-guide__icon"><Icon aria-hidden="true" /></span>
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.summary}</p>
              </div>
              {!compact && <ul>{entry.advice.map((advice) => <li key={advice}>{advice}</li>)}</ul>}
              <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
                {entry.sourceLabel}<ExternalLink aria-hidden="true" />
              </a>
              {!compact && entry.secondarySourceUrl && <a className="kl-transport-guide__secondary-source" href={entry.secondarySourceUrl} target="_blank" rel="noopener noreferrer">
                Source complémentaire<ExternalLink aria-hidden="true" />
              </a>}
              <small>Vérifié le {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${entry.lastVerifiedAt}T00:00:00Z`))}</small>
            </article>
          );
        })}
      </div>

      {compact && <Link className="editorial-link" href="/destination/kuala-lumpur/transport">
        Lire le guide transport complet <ExternalLink aria-hidden="true" />
      </Link>}
    </section>
  );
}
