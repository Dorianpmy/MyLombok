import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand-lockup${compact ? " brand-lockup--compact" : ""}`} href="/" aria-label="MyLombok, retour à l’accueil">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="presentation">
          <path d="M8.5 34.5c0-13.2 6.2-22 11.7-22 4.1 0 5 5.8 5 13.1 0-7.3 1.2-13.1 5.3-13.1 5.2 0 9 8.8 9 22" />
          <path className="brand-wave" d="M8 35.5c6.2 3.2 12.4 3.2 18.6 0 5-2.5 9.4-2.7 13.4-.6" />
        </svg>
      </span>
      <span className="brand-words">
        <strong>MyLombok</strong>
        {!compact && <small>Conciergerie locale</small>}
      </span>
    </Link>
  );
}
