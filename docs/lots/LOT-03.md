# LOT-03 — Backend d'authentification réel

## Objectif

Remplacer la connexion mock du LOT-01 par une vraie authentification backend : base de
données PostgreSQL, table `users`, JWT, redirection par rôle basée sur le vrai token.

## Périmètre

**Inclus :**
- Connexion à PostgreSQL via `pg` (pool), URL prise dans `process.env.DATABASE_URL`.
- `server/src/db/schema.sql` : création de la table `users` (voir `docs/SPECS.md` section
  "Modèle de données").
- `server/src/db/seed.js`, exécutable via `npm run seed` dans `server/` : crée les 3 comptes
  de test (`docs/SPECS.md` section "Comptes de test") avec mots de passe hashés (`bcryptjs`).
  Le script doit être idempotent ou à défaut vider/recréer la table avant d'insérer (pas de
  doublons si on le relance).
- `POST /api/auth/login` : vérifie email + mot de passe (bcrypt compare), renvoie un JWT
  (signé avec `process.env.JWT_SECRET`, expiration raisonnable ex. 7 jours) + l'objet user,
  exactement comme défini dans le contrat d'API de `docs/SPECS.md`.
- `GET /api/auth/me` : middleware de vérification JWT (lit le header `Authorization: Bearer
  <token>`, vérifie et décode), renvoie l'utilisateur courant. `401` si token absent/invalide.
- Middleware `requireRole(...roles)` réutilisable par les prochains lots (pas forcément
  utilisé ailleurs qu'auth dans ce lot, mais doit exister et être prêt).
- Frontend : `AuthContext` appelle désormais `POST /api/auth/login` (plus la liste mock de
  comptes), stocke le vrai JWT dans `localStorage`, l'envoie dans le header `Authorization`
  sur les futurs appels API. Au chargement de l'app, si un token est présent en
  `localStorage`, appeler `GET /api/auth/me` pour restaurer la session (si le token est
  invalide/expiré, déconnecter et rediriger vers `/login`).
- La logique de redirection par rôle (client/staff/admin) déjà en place au LOT-01 continue
  de fonctionner à l'identique, mais basée sur la vraie réponse du backend.
- Supprimer `client/src/data/mockUsers.js` (n'est plus utilisé).

**Exclus (pas dans ce lot) :**
- Le menu, les commandes et les comptes staff restent en données fictives côté frontend
  (inchangés depuis LOT-01/LOT-02) — seule l'authentification devient réelle.
- Pas d'inscription (signup) : les comptes existent uniquement via le seed (ou plus tard via
  l'admin, mais ça reste mock jusqu'à la fin des 5 lots).
- Pas de "mot de passe oublié", pas de refresh token — un simple JWT avec expiration suffit.

## Fichiers à créer/modifier

- `server/src/db/pool.js` (instance `pg.Pool`).
- `server/src/db/schema.sql`, `server/src/db/seed.js`.
- `server/src/middleware/auth.js` (vérification JWT), `server/src/middleware/requireRole.js`.
- `server/src/routes/auth.routes.js`, `server/src/controllers/auth.controller.js`.
- `server/src/app.js` (brancher les routes auth).
- `server/package.json` (ajouter le script `seed`, dépendances `pg`, `bcryptjs`,
  `jsonwebtoken`).
- `client/src/context/AuthContext.jsx` (appels réels à l'API).
- `client/src/api/http.js` (ou équivalent) : wrapper fetch centralisé qui ajoute le header
  `Authorization` quand un token est présent, et gère les erreurs JSON de façon uniforme.
- Suppression de `client/src/data/mockUsers.js`.

## Critères d'acceptation

- [ ] `npm run seed` dans `server/` crée (ou recrée proprement) les 3 comptes de test.
- [ ] `POST /api/auth/login` avec `client@test.com` / `client123` renvoie `200`, un token et
      l'objet user attendu.
- [ ] `POST /api/auth/login` avec un mauvais mot de passe renvoie `401` et
      `{ "error": "..." }`.
- [ ] `GET /api/auth/me` avec un token valide renvoie l'utilisateur courant.
- [ ] `GET /api/auth/me` sans token, ou avec un token invalide, renvoie `401`.
- [ ] Se connecter depuis l'interface `/login` avec chacun des 3 comptes redirige toujours
      vers la bonne page selon le rôle (comme au LOT-01/LOT-02).
- [ ] Rafraîchir la page (F5) une fois connecté garde la session active (grâce à
      `GET /api/auth/me` au chargement).
- [ ] Le mot de passe n'est jamais stocké ni renvoyé en clair, ni dans la table `users`, ni
      dans aucune réponse API.
- [ ] `JWT_SECRET` et `DATABASE_URL` sont lus depuis `process.env`, jamais codés en dur.
- [ ] Le parcours menu/panier/mes commandes/staff/admin en données fictives continue de
      fonctionner sans régression (inchangé, juste maintenant derrière une vraie connexion).
- [ ] Aucun fichier dans `docs/`, ni `CLAUDE.md`, ni `replit.md` n'a été modifié.

## Prompt prêt à copier-coller dans Replit Agent

```
Implémente le LOT-03 tel que décrit dans docs/lots/LOT-03.md, en respectant strictement
les règles et la stack décrites dans replit.md et le contrat d'API décrit dans
docs/SPECS.md. Ce lot ne concerne QUE l'authentification : remplace la connexion mock par
un vrai backend (PostgreSQL + JWT + bcrypt), sans toucher au menu, aux commandes ni aux
comptes staff qui restent en données fictives comme livré aux LOT-01/LOT-02. Utilise
process.env.DATABASE_URL et process.env.JWT_SECRET, jamais de secret en dur. Ne modifie
aucun fichier dans docs/, ni CLAUDE.md, ni replit.md.
Une fois terminé, vérifie toi-même chaque ligne de la checklist "Critères d'acceptation" de
LOT-03.md avant de considérer le travail fini.
```
