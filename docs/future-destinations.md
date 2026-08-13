# Ajouter une destination future

L’architecture peut accueillir d’autres destinations, mais aucune carte vide ne doit apparaître dans l’application publique. Langkawi et Koh Lipe restent donc absentes du registre actif tant que leur contenu n’est pas validé.

## Procédure

1. Étudier le besoin produit et définir les modules réellement proposés.
2. Étendre `DestinationId` puis ajouter la destination à `app/data/destinations.ts` avec coordonnées, limites, fuseau, devise, langues, image et modules.
3. Créer un fichier de lieux centralisé utilisant `TravelPlace`.
4. Ajouter ce contenu derrière `placeRepository`, sans importer le fichier directement dans les composants.
5. Vérifier chaque lieu selon [content-verification.md](./content-verification.md).
6. Tester le sélecteur, les routes dynamiques, Explorer, la carte, les fiches, les favoris et Mon voyage.
7. Vérifier responsive, accessibilité, performance, cache et CSP.
8. Activer la destination dans le registre public uniquement lorsque les étapes précédentes sont terminées.

## Critères minimaux d’activation

- une identité éditoriale compatible avec MyLombok ;
- un hero réel et correctement licencié ;
- un nombre suffisant de lieux utiles et répartis par zones ;
- coordonnées, sources et dates de vérification pour chaque lieu ;
- carte cadrée et attribution conforme ;
- filtres qui correspondent réellement aux données ;
- aucune page de module désactivé ;
- aucun service de conciergerie ou d’expatriation promis sans disponibilité réelle.

## Langkawi et Koh Lipe

Pour chacune de ces destinations, préparer le contenu sur une branche ou dans un fichier non enregistré dans le registre public. Ne pas ajouter de carte « bientôt disponible » dans `/destinations` sans décision produit. L’ajout futur doit réutiliser les routes dynamiques et les composants existants ; il ne doit pas créer une nouvelle marque ni une copie de l’application.
