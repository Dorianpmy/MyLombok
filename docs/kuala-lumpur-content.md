# Contenu éditorial de Kuala Lumpur

La première base Kuala Lumpur est conservée dans `app/data/kuala-lumpur-places.ts`. Elle contient des lieux réels, des coordonnées sourcées et une vérification datée du 5 août 2026. Les textes sont des résumés originaux ; ils ne recopient pas les descriptions des sources.

## Lieux intégrés

| Zone | Lieux | Catégories principales |
| --- | --- | --- |
| KLCC | KLCC Park, PETRONAS Twin Towers, Suria KLCC, Aquaria KLCC, Saloma Link | parc, attraction, shopping, famille, point de vue |
| Centre historique | Merdeka Square, Sultan Abdul Samad Building, Central Market, Petaling Street, Masjid Negara | culture, marché, mosquée |
| Bukit Bintang | Jalan Alor, Pavilion Kuala Lumpur, Bukit Bintang | cuisine, shopping, quartier |
| Culture et vues | Thean Hou Temple, Islamic Arts Museum Malaysia, Kuala Lumpur Tower, Perdana Botanical Gardens | culture, point de vue, parc |

## Sources utilisées

Chaque fiche stocke ses propres `sourceUrls`, notamment :

- sites officiels des lieux : [PETRONAS Twin Towers](https://www.petronastwintowers.com.my/), [Aquaria KLCC](https://aquariaklcc.com/), [Suria KLCC](https://www.suriaklcc.com.my/), [Central Market](https://centralmarket.com.my/), [Pavilion Kuala Lumpur](https://www.pavilion-kl.com/), [Islamic Arts Museum Malaysia](https://iamm.org.my/) et [Kuala Lumpur Tower](https://kltower.com/) ;
- organismes publics : [Tourism Malaysia](https://www.malaysia.travel/), [DBKL](https://www.dbkl.gov.my/) et les annuaires officiels religieux malaisiens ;
- OpenStreetMap, utilisé comme seconde référence cartographique et non comme source d’horaires ou de statut commercial.

Le lien officiel et le lien de réservation ne sont renseignés que lorsqu’ils appartiennent à l’établissement. Les itinéraires ouvrent une recherche cartographique à partir des coordonnées, sans promettre une durée de trajet.

## Informations volontairement non affirmées

Les éléments suivants restent vides ou portent une mention « à vérifier » tant qu’une preuve actuelle n’est pas disponible :

- horaires et tarifs susceptibles de changer ;
- disponibilité réelle des poussettes et équipements bébé ;
- accessibilité détaillée d’un parcours ;
- statut halal d’un vendeur ou d’une rue entière ;
- horaires de visite touristique des mosquées ;
- temps de marche et temps routiers exacts ;
- disponibilité ou places restantes.

Un restaurant n’est jamais déclaré halal par déduction géographique. Jalan Alor et Petaling Street conservent un statut `to-check`, car chaque vendeur doit être vérifié séparément.

## Maintenance

Lors d’une révision, mettre à jour la source concernée, `lastVerifiedAt` et, si nécessaire, `verificationStatus`. Une information obsolète doit être retirée ou archivée plutôt que conservée par défaut. La procédure complète se trouve dans [content-verification.md](./content-verification.md).
