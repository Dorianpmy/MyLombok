import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main className="state-page"><span className="eyebrow">Erreur 404</span><h1>Cette étape n’existe pas.</h1><p>Le lien a peut-être changé. Revenez au carnet pour poursuivre votre préparation.</p><Link className="button button--primary" href="/"><ArrowLeft aria-hidden="true" /> Retour à l’accueil</Link></main>;
}
