import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer__grid">
        <div className="site-footer__brand">
          <Brand />
          <p>Aide concrète pour s’installer proprement à Lombok — zones, tips et accompagnement local.</p>
        </div>
        <div>
          <strong>S’installer</strong>
          <Link href="/zones">Zones d’installation</Link>
          <Link href="/tips">Tips pratiques</Link>
          <Link href="/parcours">Parcours guidé</Link>
        </div>
        <div>
          <strong>Accompagnement</strong>
          <Link href="/accompagnement">Accompagnement A à Z</Link>
          <Link href="/contacts">Contacts utiles</Link>
          <Link href="/a-propos">À propos</Link>
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
