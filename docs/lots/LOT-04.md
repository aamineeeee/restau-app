# LOT-04 — Backend commande client

## Objectif

Remplacer le menu fictif et les commandes fictives côté client par de vraies données
backend : menu en base, création de commande à partir du panier, historique réel du client.

## Périmètre

**Inclus :**
- `server/src/db/schema.sql` : ajout des tables `menu_items`, `orders`, `order_items` (voir
  `docs/SPECS.md` section "Modèle de données").
- `server/src/db/seed.js` : étendu pour insérer un jeu d'articles de menu (reprendre les
  mêmes articles que `client/src/data/mockMenu.js` du LOT-01, pour garder une continuité
  visuelle), en plus des 3 comptes de test déjà créés au LOT-03. Toujours idempotent /
  rejouable sans doublons.
- `GET /api/menu` : renvoie les articles de menu disponibles depuis la base, exactement
  comme défini dans le contrat d'API de `docs/SPECS.md`. Accessible à tout rôle authentifié.
- `POST /api/orders` (rôle `client` uniquement — `requireRole('client')`) : crée une commande
  à partir du body `{ items: [{ menuItemId, quantity }] }`. Le prix et le total sont
  recalculés côté serveur à partir de `menu_items` (ne jamais faire confiance à un prix
  envoyé par le client). `400` si `items` est vide, si un `menuItemId` n'existe pas ou n'est
  plus disponible. Statut initial `recue`.
- `GET /api/orders/mine` (rôle `client` uniquement) : renvoie les commandes du client
  connecté, plus récentes en premier, avec leurs articles.
- Frontend :
  - Page Menu (`/menu`) : charge les articles via `GET /api/menu` au lieu de
    `client/src/data/mockMenu.js`. Affiche un état de chargement et un message d'erreur si
    l'appel échoue.
  - Bouton "Valider la commande" sur `/panier` : appelle `POST /api/orders` avec le contenu
    du panier, vide le panier seulement si l'appel réussit, affiche une erreur sinon,
    redirige vers `/mes-commandes` en cas de succès.
  - Page Mes commandes (`/mes-commandes`) : charge les commandes via `GET /api/orders/mine`
    au lieu de `localStorage`. Affiche un état de chargement et un message si la liste est
    vide.
  - Le panier (`CartContext`) reste stocké côté client (`localStorage`) — ce n'est qu'au
    moment de la validation qu'il devient une vraie commande en base.
- Supprimer `client/src/data/mockMenu.js` et l'ancien mécanisme `localStorage` pour "mes
  commandes" du LOT-01 (remplacés par les vrais appels API).

**Exclus (pas dans ce lot) :**
- Le dashboard staff (`GET /api/orders`, `PATCH /api/orders/:id/status`) reste en données
  fictives comme livré au LOT-02 — c'est l'objet du LOT-05.
- Le menu et les comptes staff gérés par l'admin restent en données fictives (LOT-02,
  inchangé — l'admin reste mock jusqu'à la fin des 5 lots).

## Fichiers à créer/modifier

- `server/src/db/schema.sql`, `server/src/db/seed.js` (extension).
- `server/src/routes/menu.routes.js`, `server/src/controllers/menu.controller.js`.
- `server/src/routes/orders.routes.js`, `server/src/controllers/orders.controller.js`.
- `server/src/app.js` (brancher les nouvelles routes).
- `client/src/pages/MenuPage.jsx`, `client/src/pages/CartPage.jsx`,
  `client/src/pages/MyOrdersPage.jsx` (appels API réels).
- `client/src/api/menu.js`, `client/src/api/orders.js` (fonctions d'appel dédiées, au-dessus
  du wrapper `client/src/api/http.js` du LOT-03).
- Suppression de `client/src/data/mockMenu.js`.

## Critères d'acceptation

- [ ] `GET /api/menu` (avec un token valide, n'importe quel rôle) renvoie les articles
      insérés par le seed, avec la forme exacte du contrat d'API.
- [ ] `GET /api/menu` sans token renvoie `401`.
- [ ] `POST /api/orders` avec un token `client` et un panier valide crée la commande, renvoie
      `201` avec le total recalculé côté serveur.
- [ ] `POST /api/orders` avec un token `staff` ou `admin` renvoie `403`.
- [ ] `POST /api/orders` avec un `menuItemId` inexistant renvoie `400`.
- [ ] `GET /api/orders/mine` ne renvoie que les commandes de l'utilisateur connecté (vérifié
      avec deux comptes clients différents s'il y en a, ou au moins par lecture du code de
      la requête SQL qui filtre bien par `user_id`).
- [ ] Dans l'interface : le menu affiché sur `/menu` correspond aux données du seed, plus de
      référence à `mockMenu.js`.
- [ ] Valider une commande depuis `/panier` crée bien une ligne visible immédiatement sur
      `/mes-commandes`, avec statut "Reçue".
- [ ] Recharger la page `/mes-commandes` (F5) montre toujours l'historique réel (persistance
      en base, plus de dépendance à `localStorage` pour les commandes).
- [ ] Le dashboard staff et les interfaces admin (LOT-02) continuent de fonctionner sans
      régression, toujours en données fictives à ce stade.
- [ ] Aucun fichier dans `docs/`, ni `CLAUDE.md`, ni `replit.md` n'a été modifié.

## Prompt prêt à copier-coller dans Replit Agent

```
Implémente le LOT-04 tel que décrit dans docs/lots/LOT-04.md, en respectant strictement
les règles et la stack décrites dans replit.md et le contrat d'API décrit dans
docs/SPECS.md. Ce lot connecte le menu et les commandes du client à une vraie base de
données : GET /api/menu, POST /api/orders, GET /api/orders/mine. Recalcule toujours le prix
et le total côté serveur à partir de menu_items, ne fais jamais confiance à un prix envoyé
par le client. Ne touche pas au dashboard staff ni aux interfaces admin, qui restent en
données fictives comme livré aux LOT-02/LOT-03. Ne modifie aucun fichier dans docs/, ni
CLAUDE.md, ni replit.md.
Une fois terminé, vérifie toi-même chaque ligne de la checklist "Critères d'acceptation" de
LOT-04.md avant de considérer le travail fini.
```
