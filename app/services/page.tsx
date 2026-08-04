import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CarFront, Compass, MessageCircle, Plane, Route, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
  title: "Nos services",
  description: "Les services MyLombok pour préparer une arrivée, des déplacements, des activités et des demandes particulières à Lombok.",
};

const services = [
  { Icon: Plane, title: "Transferts et arrivée", text: "Préparer un trajet depuis l’aéroport ou un port, avec vos horaires et votre destination clairement transmis.", query: "transfert" },
  { Icon: CarFront, title: "Mobilité sur l’île", text: "Clarifier le choix entre scooter, voiture et chauffeur selon votre itinéraire et votre niveau de confort.", query: "mobilite" },
  { Icon: Compass, title: "Activités et excursions", text: "Sélectionner des expériences cohérentes avec la saison, votre rythme et la zone où vous séjournez.", query: "activite" },
  { Icon: UtensilsCrossed, title: "Restaurants et occasions", text: "Chercher une table, une ambiance ou une attention particulière et vous transmettre le contact disponible.", query: "restaurant" },
  { Icon: Route, title: "Organisation du séjour", text: "Mettre à plat vos dates, vos priorités et vos déplacements sans figer chaque journée.", query: "sejour" },
  { Icon: MessageCircle, title: "Demande particulière", text: "Commencer par un besoin concret lorsqu’il ne correspond pas aux catégories habituelles.", query: "autre" },
];

export default function ServicesPage() {
  return <main className="inner-page"><header className="simple-page-header simple-page-header--center"><div className="site-container"><span className="eyebrow">Conciergerie locale</span><h1>Le bon niveau d’aide, au bon moment.</h1><p>Chaque service commence par une demande claire. Aucune réservation ni aucun paiement n’est déclenché automatiquement.</p></div></header><section className="site-section"><div className="site-container service-page-grid">{services.map(({ Icon, title, text, query }, index) => <article key={title}><span className="service-page-grid__index">0{index + 1}</span><Icon aria-hidden="true" /><h2>{title}</h2><p>{text}</p><Link className="editorial-link" href={`/conciergerie?service=${query}`}>Faire une demande <ArrowRight aria-hidden="true" /></Link></article>)}</div></section><section className="site-section service-page-note"><div className="site-container"><div><span className="eyebrow eyebrow--light">Vous préférez commencer seul ?</span><h2>Explorez l’île avant de nous écrire.</h2><p>Le carnet vous aide à repérer les zones, les distances et les informations pratiques à confirmer.</p></div><Link className="button button--light" href="/explorer">Ouvrir Explorer <ArrowRight aria-hidden="true" /></Link></div></section></main>;
}
