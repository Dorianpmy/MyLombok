# Configuration de la carte

## Fournisseur actuel

La carte multi-destination réutilise Leaflet, déjà présent dans le projet. Le fond utilise les tuiles publiques CARTO basées sur OpenStreetMap :

```text
https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png
```

L’attribution « OpenStreetMap contributors · CARTO » reste visible. Elle ne doit pas être masquée par une bottom sheet ou un contrôle.

## Chargement et rendu

- Le composant cartographique est importé dynamiquement avec `ssr: false`.
- Leaflet n’est chargé que sur une vue carte.
- Le centre, le zoom et les limites viennent de la destination active.
- Les marqueurs sont regroupés visuellement par cellules selon le niveau de zoom afin de conserver une carte lisible.
- La liste complète reste disponible comme alternative accessible.
- Si le module ne se charge pas, l’interface conserve la liste et un état de chargement explicite plutôt qu’un écran vide.

## Localisation

La position n’est jamais demandée au chargement. `navigator.geolocation` est appelé uniquement après activation du bouton « Utiliser ma position ». La position sert à l’affichage courant et n’est pas écrite dans le catalogue public.

Le mode « Autour de mon hôtel » utilise les coordonnées privées saisies dans Mon voyage. Sans moteur d’itinéraire, seule une distance géodésique approximative peut être utilisée ; aucun temps routier ne doit être annoncé.

## Clés et variables

Le fond CARTO actuel ne nécessite pas de clé intégrée au navigateur. Aucune clé n’est codée dans un composant. Si un autre fournisseur est ajouté, utiliser des variables documentées, par exemple :

```dotenv
NEXT_PUBLIC_MAP_STYLE_URL=
NEXT_PUBLIC_MAP_ACCESS_TOKEN=
```

Ne jamais placer de secret serveur dans une variable `NEXT_PUBLIC_*`. Prévoir un mode liste lorsque les variables sont absentes.

## Production

Avant publication :

1. autoriser uniquement les domaines de tuiles et d’images nécessaires dans la CSP ;
2. vérifier l’attribution et les conditions d’utilisation du fournisseur ;
3. tester les limites de Lombok et Kuala Lumpur sur mobile et desktop ;
4. vérifier navigation clavier, texte alternatif et cibles tactiles ;
5. ne pas mettre agressivement les tuiles externes en cache dans le service worker ;
6. conserver les pages de voyage et de favoris hors du cache partagé.
