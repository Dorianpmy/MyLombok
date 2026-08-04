import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer__grid">
        <div className="site-footer__brand">
          <Brand />
          <p>Une présence locale pour préparer et simplifier votre séjour à Lombok.</p>
        </div>
        <div>
          <strong>Découvrir</strong>
          <Link href="/explorer">Explorer Lombok</Link>
          <Link href="/services">Nos services</Link>
          <Link href="/a-propos">À propos</Link>
        </div>
        <div>
          <strong>Votre séjour</strong>
          <Link href="/conciergerie">Parler à la conciergerie</Link>
          <Link href="/profil">Mon espace</Link>
          <Link href="/installer">Installer l’application</Link>
        </div>
        <div>
          <strong>Informations</strong>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
          <a href="https://wa.me/33763664857" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
      </div>
      <div className="site-container site-footer__bottom">
        <span>© {new Date().getFullYear()} MyLombok</span>
        <span>Photographies : <a href="https://commons.wikimedia.org/wiki/File:Selamat_Pagi,_Kuta_Lombok.jpg" target="_blank" rel="noreferrer">Focusfeel</a> et <a href="https://commons.wikimedia.org/wiki/File:Lombok,_Island_beach_in_the_bay,_Palm_trees,_Indonesia.jpg" target="_blank" rel="noreferrer">Vyacheslav Argenberg</a>, via Wikimedia Commons.</span>
      </div>
    </footer>
  );
}
