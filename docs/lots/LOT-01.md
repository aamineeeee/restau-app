# LOT-01 — Structure du projet + connexion mock + interfaces client

## Objectif

Poser la structure du projet (frontend + backend) et livrer un parcours client complet
(connexion, menu, panier, mes commandes) fonctionnant entièrement avec des données
fictives, sans base de données ni vraie authentification.

## Périmètre

**Inclus :**
- Structure des dossiers `client/`, `server/`, `package.json` racine avec script `dev`
  (voir `replit.md`).
- Backend Express minimal : une seule route `GET /api/health` renvoyant `{ "status": "ok" }`,
  CORS activé. Pas de base de données, pas d'authentification à ce stade.
- Frontend React (Vite) avec routing (`react-router-dom`).
- Page de connexion (`/login`) : formulaire email + mot de passe. Vérifie les identifiants
  contre une liste de 3 comptes fictifs codés en dur côté frontend (mêmes identifiants que
  `docs/SPECS.md` section "Comptes de test"). Stocke l'utilisateur connecté (id, name,
  email, role) dans `localStorage` via un `AuthContext`, avec un faux token (ex : une chaîne
  statique). Redirige selon le rôle :
  - `client` → `/menu`
  - `staff` → `/staff` (page temporaire "Bientôt disponible", sera construite au LOT-02)
  - `admin` → `/admin` (page temporaire "Bientôt disponible", sera construite au LOT-02)
- Route protégée : un utilisateur non connecté qui accède à une page protégée est redirigé
  vers `/login`. Un utilisateur connecté avec le mauvais rôle est redirigé vers l'accueil de
  son propre rôle.
- Page **Menu** (`/menu`) : liste d'articles fictifs codés en dur dans le frontend (au moins
  6 articles, répartis sur au moins 2 catégories), avec la forme exacte des objets définie
  dans `docs/SPECS.md` section "Contrat d'API" → `GET /api/menu`. Chaque article a un
  sélecteur de quantité et un bouton "Ajouter au panier".
- `CartContext` : état du panier (liste de `{ menuItemId, name, price, quantity }`),
  persisté dans `localStorage`. Fonctions ajouter/retirer/modifier quantité/vider.
- Page **Panier** (`/panier`) : liste des lignes du panier, quantité modifiable, suppression
  par ligne, total général, bouton "Valider la commande". Panier vide → message + lien vers
  le menu.
- Bouton "Valider la commande" : crée un objet commande fictif ayant exactement la forme de
  la réponse `POST /api/orders` définie dans `docs/SPECS.md` (avec `status: "recue"`,
  `createdAt` = date courante), l'ajoute à une liste de commandes du client stockée dans
  `localStorage`, vide le panier, redirige vers `/mes-commandes`.
- Page **Mes commandes** (`/mes-commandes`) : liste des commandes fictives du client stockées
  en `localStorage`, plus récente en premier, avec badge de statut coloré.
- Un header/nav simple visible sur les pages client, avec : lien Menu, lien Panier (avec
  compteur d'articles), lien Mes commandes, nom de l'utilisateur connecté, bouton
  déconnexion.

**Exclus (pas dans ce lot) :**
- Toute base de données.
- Tout vrai JWT / hash de mot de passe.
- Les interfaces staff et admin détaillées (juste une page placeholder qui affiche un
  message, pour valider la redirection par rôle).
- Tout appel réseau vers le backend autre que `GET /api/health` (qui sert juste à prouver
  que le backend tourne — pas besoin de l'appeler depuis le frontend dans ce lot).

## Fichiers à créer/modifier

- `package.json` (racine) — script `dev` avec `concurrently`.
- `.gitignore` (déjà fourni par l'architecte, ne pas écraser le contenu existant sans raison).
- `server/package.json`, `server/server.js`, `server/src/app.js`.
- `client/package.json`, `client/vite.config.js`, `client/index.html`,
  `client/src/main.jsx`, `client/src/App.jsx`.
- `client/src/context/AuthContext.jsx`, `client/src/context/CartContext.jsx`.
- `client/src/pages/LoginPage.jsx`, `client/src/pages/MenuPage.jsx`,
  `client/src/pages/CartPage.jsx`, `client/src/pages/MyOrdersPage.jsx`,
  `client/src/pages/PlaceholderPage.jsx` (pour staff/admin).
- `client/src/components/` (header/nav, carte article, ligne panier, badge statut, etc. —
  au choix de l'implémentation, en restant minimaliste).
- `client/src/data/mockMenu.js` (les articles fictifs).
- `client/src/data/mockUsers.js` (les 3 comptes fictifs).

## Critères d'acceptation

- [ ] `npm run dev` à la racine lance backend + frontend sans erreur.
- [ ] `GET /api/health` répond `{ "status": "ok" }`.
- [ ] Connexion avec `client@test.com` / `client123` redirige vers `/menu`.
- [ ] Connexion avec `staff@test.com` / `staff123` redirige vers `/staff` (placeholder).
- [ ] Connexion avec `admin@test.com` / `admin123` redirige vers `/admin` (placeholder).
- [ ] Connexion avec de mauvais identifiants affiche un message d'erreur, ne redirige pas.
- [ ] Accéder à `/menu` sans être connecté redirige vers `/login`.
- [ ] Le menu affiche au moins 6 articles fictifs sur au moins 2 catégories.
- [ ] Ajouter un article au panier met à jour le compteur dans le header.
- [ ] La page panier permet de modifier une quantité et de supprimer une ligne, et recalcule
      le total.
- [ ] Valider la commande vide le panier, redirige vers `/mes-commandes`, et la nouvelle
      commande apparaît avec le statut "Reçue".
- [ ] Rafraîchir la page (F5) conserve le panier et l'historique des commandes (persistés en
      `localStorage`).
- [ ] Déconnexion ramène à `/login` et efface la session.
- [ ] Aucun fichier dans `docs/`, ni `CLAUDE.md`, ni `replit.md` n'a été modifié.

## Prompt prêt à copier-coller dans Replit Agent

```
Implémente le LOT-01 tel que décrit dans docs/lots/LOT-01.md, en respectant strictement
les règles et la stack décrites dans replit.md et le contrat d'API décrit dans
docs/SPECS.md. Ne code que ce qui est dans le périmètre "Inclus" de LOT-01.md — n'implémente
pas encore les interfaces staff/admin détaillées ni aucune connexion à une base de données.
Ne modifie aucun fichier dans docs/, ni CLAUDE.md, ni replit.md.
Une fois terminé, vérifie toi-même chaque ligne de la checklist "Critères d'acceptation" de
LOT-01.md avant de considérer le travail fini.
```
