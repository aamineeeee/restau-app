# Gestion de commandes — Restaurant

Application web minimaliste de gestion de commandes pour un restaurant, développée dans un
cadre pédagogique. Trois rôles : client (commande), staff (traite les commandes), admin
(gère le menu et les comptes staff).

## Stack

JavaScript (pas de TypeScript) · React + Vite (frontend) · Node.js + Express (backend) ·
PostgreSQL · authentification par JWT.

## Lancer le projet en local

Prérequis : Node.js, Docker.

1. Copier `server/.env.example` vers `server/.env` (non commité).
2. Démarrer une base PostgreSQL locale via Docker (une seule fois — le conteneur
   persiste ensuite, le redémarrer avec `docker start latable-postgres`) :
   ```bash
   docker run --name latable-postgres \
     -e POSTGRES_USER=latable -e POSTGRES_PASSWORD=latable -e POSTGRES_DB=latable \
     -p 5433:5432 -d postgres:16-alpine
   ```
   (Le port hôte `5433` évite un conflit si un autre projet utilise déjà le 5432.
   `server/.env.example` est déjà configuré pour ce port.)
3. Installer les dépendances et initialiser la base :
   ```bash
   npm install
   npm run seed --prefix server   # crée le schéma + les comptes de test
   ```
4. Lancer l'application :
   ```bash
   npm run dev   # backend sur :3001, frontend sur :5000
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
