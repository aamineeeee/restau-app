# LOT-02 — Interfaces staff et admin (données fictives)

## Objectif

Compléter le parcours staff (dashboard des commandes) et admin (gestion du menu et des
comptes staff), toujours avec des données fictives, en remplaçant les pages placeholder du
LOT-01.

## Périmètre

**Inclus :**
- Page **Dashboard staff** (`/staff`) : liste de commandes fictives (au moins 4, avec des
  statuts différents et au moins 2 clients différents), ayant exactement la forme de
  `GET /api/orders` définie dans `docs/SPECS.md` (inclut `customerName`). Données codées en
  dur dans `client/src/data/mockOrders.js`, chargées dans un état React local à l'affichage
  (pas besoin de `localStorage` ici, un simple `useState` initialisé depuis le mock suffit).
  Pour chaque commande : date, nom du client, articles + quantités, total, badge de statut,
  et un bouton pour faire avancer le statut à l'étape suivante (`recue` → `en_preparation`
  → `prete`). Pas de bouton sur une commande déjà `prete`. Le changement de statut ne modifie
  que l'état local de cette page (pas de synchronisation avec la page client "Mes commandes"
  à ce stade — ce sera fait au LOT-05 avec le vrai backend).
- Page **Gestion du menu (admin)** (`/admin/menu`) : tableau des articles de menu fictifs
  (réutilise `client/src/data/mockMenu.js` du LOT-01, ou l'étend si besoin), avec :
  - formulaire d'ajout d'un article (nom, description, prix, catégorie, disponibilité)
  - action "modifier" par ligne (formulaire pré-rempli)
  - action "supprimer" par ligne
  Toutes ces actions ne modifient que l'état React local de la page (pas d'appel réseau).
- Page **Gestion du staff (admin)** (`/admin/staff`) : tableau de comptes staff fictifs
  (nom, email), avec formulaire d'ajout et action supprimer par ligne. État React local
  uniquement.
- Une nav simple pour l'admin permettant de basculer entre `/admin/menu` et `/admin/staff`.
- Remplacer les pages `PlaceholderPage` utilisées pour `/staff` et `/admin` au LOT-01 par ces
  vraies pages.

**Exclus (pas dans ce lot) :**
- Toute base de données, tout appel réseau vers le backend pour ces données (menu, staff,
  commandes restent 100% fictifs et non persistés au rechargement de page — sauf le panier
  et "mes commandes" côté client qui restent tels que livrés au LOT-01).
- Toute synchronisation entre le changement de statut fait par le staff et ce que voit le
  client sur `/mes-commandes` (viendra au LOT-05).
- Toute modification du parcours client déjà livré au LOT-01 (sauf le remplacement des
  placeholders `/staff` et `/admin`).

## Fichiers à créer/modifier

- `client/src/pages/StaffDashboardPage.jsx`.
- `client/src/pages/AdminMenuPage.jsx`, `client/src/pages/AdminStaffPage.jsx`.
- `client/src/data/mockOrders.js`.
- `client/src/components/` (carte commande staff, formulaire article, formulaire compte
  staff, nav admin — au choix, en restant minimaliste).
- `client/src/App.jsx` (mise à jour du routing : retirer `PlaceholderPage`, brancher les
  nouvelles pages pour `/staff`, `/admin/menu`, `/admin/staff`).

## Critères d'acceptation

- [ ] Connexion `staff@test.com` affiche le dashboard avec au moins 4 commandes fictives.
- [ ] Chaque commande affiche articles, quantités, total, nom du client, statut.
- [ ] Le bouton d'avancement de statut fait progresser `recue` → `en_preparation` →
      `prete`, et disparaît une fois `prete` atteint.
- [ ] Connexion `admin@test.com` donne accès à `/admin/menu` et `/admin/staff` via une nav.
- [ ] Sur `/admin/menu` : ajouter, modifier et supprimer un article fonctionnent et mettent
      à jour le tableau immédiatement.
- [ ] Sur `/admin/staff` : ajouter et supprimer un compte staff fonctionnent et mettent à
      jour le tableau immédiatement.
- [ ] Le parcours client du LOT-01 (menu → panier → mes commandes) fonctionne toujours sans
      régression.
- [ ] Aucun fichier dans `docs/`, ni `CLAUDE.md`, ni `replit.md` n'a été modifié.

## Prompt prêt à copier-coller dans Replit Agent

```
Implémente le LOT-02 tel que décrit dans docs/lots/LOT-02.md, en respectant strictement
les règles et la stack décrites dans replit.md et le contrat d'API décrit dans
docs/SPECS.md. Ne code que ce qui est dans le périmètre "Inclus" de LOT-02.md — toutes les
données (commandes, menu, comptes staff) restent fictives, sans aucun appel réseau ni base
de données. Ne modifie pas le parcours client déjà livré au LOT-01, sauf pour remplacer les
pages placeholder de /staff et /admin. Ne modifie aucun fichier dans docs/, ni CLAUDE.md,
ni replit.md.
Une fois terminé, vérifie toi-même chaque ligne de la checklist "Critères d'acceptation" de
LOT-02.md avant de considérer le travail fini.
```
