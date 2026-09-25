# replit.md — Instructions pour Replit Agent

Ce fichier est ta référence de contexte pour ce projet. Lis-le entièrement avant de commencer
à coder, à chaque session.

## Ce que tu construis

Une application web MINIMALISTE de gestion de commandes pour un restaurant. C'est un projet
de cours : privilégie toujours la solution la plus simple qui satisfait les critères
d'acceptation du lot demandé. N'ajoute pas de fonctionnalités, de pages ou d'options qui ne
sont pas explicitement demandées dans le lot en cours.

Les spécifications complètes (rôles, écrans, parcours, modèle de données, contrat d'API,
comptes de test) sont dans `docs/SPECS.md`. Le détail de chaque lot (périmètre, fichiers,
critères d'acceptation) est dans `docs/lots/LOT-0X.md`. **Lis toujours le fichier du lot
demandé avant de coder.**

## Règles absolues

1. **N'implémente que le lot explicitement demandé dans le message qu'on te donne.**
   Ne commence pas le lot suivant, même si tu penses que ça ferait gagner du temps.
2. **Ne modifie jamais rien dans `docs/`, ni `CLAUDE.md`, ni ce fichier (`replit.md`).**
   Ce sont des fichiers gérés par l'architecte du projet (Claude Code), pas par toi.
3. **Respecte le contrat d'API défini dans `docs/SPECS.md` à la lettre** : mêmes routes,
   mêmes méthodes HTTP, même forme de payload en entrée/sortie, mêmes codes de statut.
   Les lots frontend en données fictives (LOT-01, LOT-02) doivent produire des objets avec
   EXACTEMENT la forme des réponses API du contrat, pour que les lots backend suivants
   n'aient qu'à remplacer le mock par un vrai appel réseau.
4. **Ne casse jamais un lot précédent.** À la fin de ton travail, l'application doit
   démarrer et fonctionner de bout en bout (même avec des parties encore mockées dans les
   lots non encore atteints).
5. **N'ajoute aucune dépendance qui ne figure pas dans ce fichier** sans qu'elle soit
   strictement nécessaire au lot en cours. Pas de librairie UI/CSS lourde (pas de
   Material UI, Bootstrap, Tailwind avec config custom, etc.) — CSS simple à la main.
6. **Aucun secret en dur dans le code.** `JWT_SECRET`, `DATABASE_URL`, etc. passent
   uniquement par des variables d'environnement (Secrets Replit / `.env` non commité).
7. Quand tu as terminé un lot, vérifie toi-même la checklist "critères d'acceptation" du
   fichier `docs/lots/LOT-0X.md` correspondant avant de considérer le travail fini.

## Stack imposée (ne pas en dévier)

- **Langage** : JavaScript uniquement. Pas de TypeScript, pas de compilation de types.
- **Frontend** : React via Vite. Routing avec `react-router-dom`. Pas de framework meta
  (pas de Next.js). État global léger via React Context (pas de Redux/Zustand/etc.).
- **Backend** : Node.js + Express.
- **Base de données** : PostgreSQL (base intégrée Replit), accédée avec le driver
  `pg` (node-postgres) et du **SQL brut** — pas d'ORM (pas de Prisma, Sequelize, Drizzle...).
  Ça reste plus simple à lire et à review pour un projet de cours.
- **Authentification** : JWT (`jsonwebtoken`), mots de passe hashés avec `bcryptjs`.
  Le token est renvoyé au login et stocké côté client dans `localStorage` ; il est envoyé
  au backend dans le header `Authorization: Bearer <token>` sur chaque requête protégée.
- **Styles** : CSS simple (fichiers `.css` classiques ou CSS Modules), pas de librairie de
  composants UI.

## Structure des dossiers (à respecter)

```
/
├── client/                  # App React (Vite)
│   ├── src/
│   │   ├── api/              # wrapper fetch centralisé (base URL, auth header, gestion erreurs)
│   │   ├── components/       # composants réutilisables
│   │   ├── context/           # AuthContext, CartContext
│   │   ├── pages/             # une page par écran (voir docs/SPECS.md)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                  # API Express
│   ├── src/
│   │   ├── db/                # pool pg, schema.sql, seed.js
│   │   ├── middleware/        # auth (vérif JWT), requireRole
│   │   ├── routes/            # un fichier de routes par ressource
│   │   ├── controllers/       # logique des routes
│   │   └── app.js             # instance Express (routes, middlewares, CORS)
│   ├── server.js              # point d'entrée, écoute sur process.env.PORT
│   └── package.json
├── docs/                    # ⚠️ ne pas toucher — géré par Claude Code
├── package.json             # scripts racine (voir "Comment lancer le projet")
├── CLAUDE.md                # ⚠️ ne pas toucher
├── replit.md                # ⚠️ ce fichier — ne pas toucher
└── .gitignore
```

## Comment lancer le projet

- Le backend écoute sur `process.env.PORT || 3001`.
- Le frontend (Vite dev server) tourne sur le port par défaut de Vite (5173) et proxy les
  requêtes `/api/*` vers `http://localhost:3001` (configuré dans `client/vite.config.js`).
- Un `package.json` à la racine expose un script `dev` qui lance le backend et le frontend
  en parallèle (avec `concurrently`), pour ne pousser qu'un seul bouton "Run" sur Replit.

## Variables d'environnement attendues

À déclarer dans les Secrets Replit (jamais commitées) :
- `DATABASE_URL` — fournie automatiquement par la base PostgreSQL intégrée Replit.
- `JWT_SECRET` — chaîne aléatoire, à générer et stocker en secret.
- `PORT` — optionnel, défaut `3001` pour le serveur Express.

## Comptes de test (seed)

Voir `docs/SPECS.md` section "Comptes de test" pour les identifiants exacts. Le script de
seed (`server/src/db/seed.js`, exécuté via `npm run seed` dans `server/`) doit créer ces
3 comptes avec des mots de passe hashés.

## En cas de doute

Si une instruction de `docs/lots/LOT-0X.md` te semble ambiguë ou en contradiction avec
`docs/SPECS.md`, arrête-toi et signale le problème plutôt que de deviner — n'improvise pas
une fonctionnalité ou une route qui ne figure pas dans le contrat d'API.
