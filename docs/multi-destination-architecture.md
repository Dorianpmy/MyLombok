# Architecture multi-destination

MyLombok reste le produit, la marque et l’expérience par défaut. La couche multi-destination ajoute des contextes de voyage sans dupliquer l’application ni modifier les anciennes routes Lombok.

## Sources de vérité

- `app/data/destination-types.ts` contient les contrats partagés (`Destination`, `TravelPlace`, `PrivateTrip`).
- `app/data/destinations.ts` est le registre public des destinations actives. Il contient uniquement Lombok et Kuala Lumpur.
- `app/data/places.ts` reste la source historique de Lombok. `legacyLombokPlaceToTravelPlace` l’adapte au modèle partagé sans modifier le catalogue existant.
- `app/data/kuala-lumpur-places.ts` contient le catalogue éditorial de Kuala Lumpur.
- Les composants passent par `destinationRepository`, `placeRepository`, `tripRepository` et `favoritesRepository`. Ils ne dépendent donc pas directement d’un fichier de contenu précis.

## Destinations et modules

| Destination | Par défaut | Explorer | Carte | Activités | Voyage | Conciergerie | Expatriation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lombok | oui | oui | oui | oui | oui | oui | oui |
| Kuala Lumpur | non | oui | oui | oui | oui | non | non |

Le registre pilote l’affichage des modules. Une fonctionnalité désactivée ne doit produire ni lien vide ni page factice. `DEFAULT_DESTINATION_ID` reste `lombok` et toute valeur inconnue est résolue vers Lombok dans les parcours compatibles avec un repli.

## Routes

Routes multi-destination :

- `/destinations`
- `/destination/[destination]`
- `/destination/[destination]/activities`
- `/destination/[destination]/map`
- `/destination/kuala-lumpur/transport`
- `/activity/[slug]`
- `/trip`
- `/saved`
- `/profil`

Les pages dynamiques utilisent le registre et renvoient une 404 pour une destination ou un lieu inconnu. Les anciennes routes `/`, `/explorer`, `/conciergerie`, `/services`, `/installer` et `/profil` restent en place. Lorsqu’une ancienne route ne porte pas de destination, son contexte reste Lombok.

## Modèle de lieu

Un `TravelPlace` possède obligatoirement :

- un identifiant et un slug stables ;
- une destination et une catégorie ;
- des coordonnées valides ;
- un résumé éditorial original ;
- un lien d’itinéraire ;
- au moins une source ;
- une date et un statut de vérification.

Les champs facultatifs (horaires, prix, accessibilité, halal, prière, durée, images) ne sont rendus que lorsqu’ils sont documentés. Les identifiants Lombok sont préfixés dans l’adaptateur afin d’éviter les collisions inter-destinations, tout en conservant `legacyId` pour les favoris existants.

## État privé

Le choix de destination peut être mémorisé sur l’appareil. Favoris et voyage restent utilisables sans compte, dans un espace local séparé pour l’invité et chaque utilisateur. Après authentification vérifiée, les dépôts peuvent synchroniser ces données dans `user_state` avec les politiques RLS existantes. Les pages privées ne doivent jamais être mises en cache comme pages publiques.

## Règles d’évolution

Une destination n’entre dans le registre public qu’après validation de son contenu, de ses limites cartographiques, de ses sources et de ses modules. Les composants génériques doivent être étendus avant de créer une variante propre à une ville. Voir [future-destinations.md](./future-destinations.md).
