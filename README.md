# Gestion de commandes — Restaurant

Application web minimaliste de gestion de commandes pour un restaurant, développée dans un
cadre pédagogique. Trois rôles : client (commande), staff (traite les commandes), admin
(gère le menu et les comptes staff).

## Stack

JavaScript (pas de TypeScript) · React + Vite (frontend) · Node.js + Express (backend) ·
PostgreSQL · authentification par JWT.

## Lancer le projet

Prérequis : Node.js, une base PostgreSQL accessible via `DATABASE_URL`.

Variables d'environnement à définir (Secrets Replit ou `.env` local non commité) :
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT` (optionnel, défaut `3001`)

```bash
npm install          # à la racine, installe aussi client/ et server/ si configuré en workspaces
npm run seed --prefix server   # crée le schéma + les comptes de test (disponible à partir du LOT-03)
npm run dev           # lance backend (port 3001) et frontend (port 5173) en parallèle
```

## Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| client | `client@test.com` | `client123` |
| staff | `staff@test.com` | `staff123` |
| admin | `admin@test.com` | `admin123` |

## Documentation

- [`docs/SPECS.md`](docs/SPECS.md) — spécifications complètes (rôles, écrans, modèle de
  données, contrat d'API).
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — avancement des lots.
- [`docs/lots/`](docs/lots) — détail de chaque lot de développement.
- [`replit.md`](replit.md) — instructions pour Replit Agent.
- [`CLAUDE.md`](CLAUDE.md) — contexte pour Claude Code (architecte / reviewer du projet).

## Organisation du projet

Développement découpé en 5 lots, implémentés par Replit Agent à partir des specs dans
`docs/`, chaque lot se terminant par une application fonctionnelle. Voir `docs/ROADMAP.md`
pour le statut actuel.
