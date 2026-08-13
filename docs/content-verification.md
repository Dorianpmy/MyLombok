# Vérification du contenu

Cette procédure s’applique à tout lieu MyLombok, quelle que soit sa destination. Une fiche non documentée ne doit pas être présentée comme vérifiée.

## Ajouter un lieu

1. Confirmer que le lieu existe avec une source officielle ou publique fiable.
2. Créer un `id` et un `slug` stables et uniques dans la destination.
3. Rédiger un résumé court et original.
4. Ajouter les coordonnées, le lien d’itinéraire, les sources, une date ISO et un statut.
5. Ne renseigner les attributs facultatifs qu’après vérification.
6. Lancer les tests de contenu avant toute publication.

Hiérarchie recommandée des sources : site officiel de l’établissement, administration ou office du tourisme, opérateur de transport, organisme de certification, puis base cartographique reconnue. Un réseau social peut confirmer une actualité, mais ne suffit pas à lui seul pour une affirmation sensible.

## Coordonnées

- Comparer au moins une source cartographique et l’adresse officielle.
- Vérifier que le marqueur correspond à l’entrée utile, pas seulement au centre du quartier.
- Tester le lien d’itinéraire.
- Refuser les coordonnées hors des limites de la destination.

## Horaires et prix

- Utiliser la page officielle ou la billetterie officielle.
- Stocker la source et la date de vérification avec l’information.
- Ne pas convertir un texte libre incertain en horaires structurés.
- Ne pas afficher « ouvert maintenant » sans horaires structurés, fuseau correct et source récente.
- Ne pas conserver un prix promotionnel comme prix permanent.

En cas de doute, supprimer la valeur et afficher « À vérifier avant votre visite ».

## Famille, bébé et accessibilité

Chaque valeur vraie doit être soutenue par une source explicite ou une validation terrain tracée. Vérifier séparément : poussette, ascenseur, table à langer, climatisation, espace calme, alimentation du bébé et difficultés d’accès. « Familial » ne prouve pas automatiquement chacun de ces services.

## Halal et prière

- Un statut `halal-verified` exige une certification, une mention officielle claire ou une source équivalente identifiable.
- La localisation en Malaisie ou en Indonésie ne constitue pas une preuve.
- En l’absence de preuve, utiliser `halal-to-check` ou ne rien afficher.
- Pour une mosquée ou une salle de prière, vérifier le nom, l’emplacement et la source officielle.
- Les horaires de prière dynamiques ne doivent pas être remplacés par une table figée non datée.

## Images

Utiliser une photo propre au lieu ou un repli visuel clairement identifié comme illustration. Conserver texte alternatif, auteur/crédit, licence et URL source lorsque l’image est externe. Ne pas réutiliser une image générique qui pourrait faire croire qu’elle montre le lieu réel.

## Révision et archivage

- `verified` : les affirmations affichées sont soutenues par des sources actuelles.
- `to-check` : le lieu peut rester repérable, mais les informations incertaines sont signalées ou masquées.
- `archived` : fermeture, source invalide ou information devenue impropre à la publication.

Lors d’une révision, mettre à jour `lastVerifiedAt`. Ne jamais modifier silencieusement une donnée sensible sans mettre à jour sa provenance.
