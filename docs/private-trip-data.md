# Données privées du voyage

Le voyage, l’hôtel, les voyageurs, les préférences, les exclusions et les notes sont des données personnelles. Ils ne font pas partie du catalogue public et ne doivent jamais être codés dans un composant, un seed ou une documentation de contenu.

## Données enregistrées

Le modèle `PrivateTrip` contient :

- destination ;
- dates de début et de fin ;
- nom, adresse facultative et coordonnées facultatives de l’hébergement ;
- nombre d’adultes et d’enfants, présence d’un bébé ;
- préférences et lieux exclus ;
- journées, ordre des lieux et notes privées ;
- date de dernière mise à jour.

Toutes les saisies sont bornées et nettoyées avant enregistrement. Le nombre de journées est limité afin d’éviter un stockage local excessif.

## Stockage local

Sans compte, le voyage et les favoris sont stockés dans l’espace `guest` du navigateur. Avec un compte, les clés locales sont séparées par identifiant utilisateur ; un utilisateur ne doit jamais relire le carnet local d’un autre compte.

Le fichier de développement éventuel suit le motif :

```text
data/private-trip.local.json
```

`data/*.local.json` est ignoré par Git. Seul `data/private-trip.example.json`, entièrement vide de données personnelles, est public.

## Synchronisation Supabase

Lorsque Supabase est configuré, l’identité est vérifiée avec `auth.getUser()` avant lecture ou écriture. Le voyage est stocké dans `user_state.preferences.trip` et les favoris dans `user_state.favorites`. Les politiques RLS limitent chaque ligne à `auth.uid() = user_id`.

La synchronisation :

- conserve les autres préférences du compte lors de la mise à jour du voyage ;
- choisit la copie la plus récente grâce à `updatedAt` ;
- continue localement si le réseau ou Supabase est indisponible ;
- n’utilise jamais de clé `service_role` dans le navigateur.

## Cache, carte et analytics

- `/trip`, `/saved`, `/profil`, `/api` et les routes d’authentification doivent rester hors du cache partagé du service worker.
- La position courante n’est demandée qu’après action explicite et n’est pas persistée automatiquement.
- Les coordonnées de l’hôtel ne doivent pas devenir des données publiques de carte.
- Aucun événement analytics ne doit contenir hôtel, dates, voyageurs, notes ou position précise.

## Export et suppression

L’utilisateur doit pouvoir corriger ou effacer son voyage. La suppression locale et la suppression cloud sont deux opérations distinctes lorsqu’un compte est utilisé ; l’interface doit indiquer clairement l’étendue de l’action.
