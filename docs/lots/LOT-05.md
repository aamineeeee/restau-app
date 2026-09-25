# LOT-05 — Backend dashboard staff

## Objectif

Remplacer le dashboard staff fictif par de vraies données backend : liste des commandes en
base, changement de statut persisté, visible côté client sans action manuelle.

## Périmètre

**Inclus :**
- `GET /api/orders` (rôle `staff` uniquement — `requireRole('staff')`) : renvoie toutes les
  commandes de tous les clients, plus récentes en premier, avec `customerName` (jointure sur
  `users`) et leurs articles, exactement comme défini dans le contrat d'API de
  `docs/SPECS.md`.
- `PATCH /api/orders/:id/status` (rôle `staff` uniquement) : body `{ "status": "..." }`.
  Valide que la transition demandée est bien la prochaine étape autorisée
  (`recue` → `en_preparation` → `prete`, dans cet ordre, sans saut ni retour en arrière).
  `400` si transition invalide, `404` si la commande n'existe pas. Met à jour `updated_at`.
  Renvoie la commande mise à jour.
- Frontend dashboard staff (`/staff`) : charge les commandes via `GET /api/orders` au lieu
  de `client/src/data/mockOrders.js`. Le bouton d'avancement de statut appelle
  `PATCH /api/orders/:id/status` et met à jour l'affichage avec la réponse du serveur (pas
  seulement l'état local).
- Frontend "Mes commandes" (`/mes-commandes`, côté client) : le statut affiché doit refléter
  les changements faits par le staff sans que le client ait besoin de se déconnecter/
  reconnecter. Solution minimale attendue : rafraîchir automatiquement la liste toutes les
  8 à 10 secondes tant que la page est affichée (ex. `setInterval` + `GET /api/orders/mine`,
  nettoyé au démontage du composant). Pas besoin de WebSocket ni de solution temps réel plus
  sophistiquée.
- Supprimer `client/src/data/mockOrders.js`.

**Exclus (pas dans ce lot) :**
- Les interfaces admin (menu, staff) restent en données fictives — c'est voulu, elles ne
  seront pas connectées au backend dans le cadre de ces 5 lots.
- Pas de filtre/tri avancé sur le dashboard staff au-delà de l'ordre "plus récente en
  premier" déjà en place.
- Pas de notification push/sonore côté client — un rafraîchissement périodique silencieux
  suffit.

## Fichiers à créer/modifier

- `server/src/controllers/orders.controller.js` (ajout des handlers `getAllOrders` et
  `updateOrderStatus`).
- `server/src/routes/orders.routes.js` (ajout des routes `GET /api/orders` et
  `PATCH /api/orders/:id/status`, protégées par `requireRole('staff')`).
- `client/src/pages/StaffDashboardPage.jsx` (appels API réels).
- `client/src/pages/MyOrdersPage.jsx` (polling périodique).
- `client/src/api/orders.js` (ajout des fonctions `fetchAllOrders`, `updateOrderStatus`).
- Suppression de `client/src/data/mockOrders.js`.

## Critères d'acceptation

- [ ] `GET /api/orders` avec un token `staff` renvoie toutes les commandes de tous les
      clients, avec `customerName` et leurs articles.
- [ ] `GET /api/orders` avec un token `client` ou `admin` renvoie `403`.
- [ ] `PATCH /api/orders/:id/status` fait avancer une commande `recue` → `en_preparation`
      avec succès (`200`, commande mise à jour renvoyée).
- [ ] `PATCH /api/orders/:id/status` avec `{ "status": "prete" }` sur une commande encore
      `recue` (saut d'étape) renvoie `400`.
- [ ] `PATCH /api/orders/:id/status` avec un id inexistant renvoie `404`.
- [ ] `PATCH /api/orders/:id/status` avec un token `client` renvoie `403`.
- [ ] Dans l'interface staff : cliquer sur le bouton d'avancement met à jour le statut
      affiché et persiste (visible après un F5).
- [ ] Un client qui a une commande en cours voit son statut évoluer sur `/mes-commandes`
      dans un délai de quelques secondes après une action du staff, sans recharger la page
      manuellement.
- [ ] Le parcours admin (LOT-02, inchangé) continue de fonctionner en données fictives.
- [ ] Aucun fichier dans `docs/`, ni `CLAUDE.md`, ni `replit.md` n'a été modifié.

## Prompt prêt à copier-coller dans Replit Agent

```
Implémente le LOT-05 tel que décrit dans docs/lots/LOT-05.md, en respectant strictement
les règles et la stack décrites dans replit.md et le contrat d'API décrit dans
docs/SPECS.md. Ce lot connecte le dashboard staff à une vraie base de données :
GET /api/orders et PATCH /api/orders/:id/status, protégés par le rôle staff, avec validation
stricte des transitions de statut (recue -> en_preparation -> prete, sans saut). Ajoute un
rafraîchissement périodique (toutes les 8-10 secondes) sur la page "Mes commandes" du client
pour que le changement de statut soit visible sans action manuelle. Ne touche pas aux
interfaces admin, qui restent volontairement en données fictives. Ne modifie aucun fichier
dans docs/, ni CLAUDE.md, ni replit.md.
Une fois terminé, vérifie toi-même chaque ligne de la checklist "Critères d'acceptation" de
LOT-05.md avant de considérer le travail fini.
```
