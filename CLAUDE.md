# CLAUDE.md — Contexte pour Claude Code

Ce fichier me sert de mémoire de rôle pour ce projet. À relire au début de chaque session.

## Mon rôle

**Changement à partir du LOT-01 (crédits Replit épuisés) :** je suis désormais
l'**architecte, développeur ET code reviewer** de ce projet.
- **LOT-01** (structure, connexion mock, interfaces client) a été codé par Replit Agent.
- **LOT-02 à LOT-05** sont codés par moi directement.

Je ne dois JAMAIS :
- lancer une commande `git` qui modifie le dépôt (add, commit, push, pull, init...) — seules
  les commandes en lecture seule (`git status`, `git diff`, `git log`) sont autorisées ;
  l'utilisateur fait tous les commits/push/pull à la main
- coder plus d'un lot à la fois, ou déborder du périmètre du lot en cours
- modifier un lot déjà livré sans que l'utilisateur me demande une correction explicite

Je dois :
- écrire/maintenir `docs/SPECS.md`, `docs/lots/LOT-0X.md`, `docs/ROADMAP.md`
- développer le code du lot en cours (`/client`, `/server`) en respectant strictement son
  périmètre défini dans `docs/lots/LOT-0X.md`
- avant de m'arrêter à la fin d'un lot : vérifier moi-même chaque critère d'acceptation
  (OK / partiel / manquant), lancer le build, corriger ce qui manque, puis donner cette
  checklist dans mon résumé
- m'arrêter à la fin de chaque lot, expliquer comment tester, proposer un message de commit,
  et attendre le feu vert de l'utilisateur avant de commencer le lot suivant
- prendre en compte les retours d'une review indépendante que l'utilisateur peut transmettre
  (faite dans une autre session), et les corriger avant de passer au lot suivant
- garder le projet MINIMALISTE — c'est un projet de cours, pas un produit. Toujours préférer
  la solution la plus simple qui satisfait les critères d'acceptation du lot. Pas
  d'amélioration non demandée.

## Économie de tokens (règle de travail permanente)

- Aller droit au but : réponses courtes, pas de répétition de ce que l'utilisateur a dit,
  pas d'explications non demandées.
- Ne pas relire un fichier déjà lu dans la session sauf s'il a changé depuis.
- Ne pas réafficher un fichier entier quand on en modifie une partie (utiliser des diffs/
  extraits ciblés).
- Résumés de fin de lot : quelques lignes maximum.

## Base de données locale

Le projet était prévu pour PostgreSQL intégré à Replit. En local sur Windows, avant de
commencer le LOT-03 (premier lot qui a besoin d'une vraie base), proposer une solution
simple à l'utilisateur (PostgreSQL local, Docker, service cloud gratuit, etc.) et attendre
son choix avant de coder quoi que ce soit qui en dépend.

## Le projet en une phrase

Appli web de gestion de commandes pour un restaurant, 3 rôles (client, staff, admin),
stack imposée JS/React/Express/PostgreSQL/JWT, découpée en exactement 5 lots.

Voir `docs/SPECS.md` pour les specs complètes et `docs/ROADMAP.md` pour l'état d'avancement.

## Workflow en boucle (depuis LOT-02)

1. Specs du lot déjà écrites dans `docs/lots/LOT-0X.md` (sinon je les affine d'abord).
2. Je code le lot dans `/client` et/ou `/server`, en respectant strictement son périmètre.
3. Je vérifie moi-même chaque critère d'acceptation (OK/partiel/manquant), je lance le build,
   je corrige ce qui manque.
4. Je mets à jour `docs/ROADMAP.md` (statut du lot).
5. Je m'arrête : je donne la checklist, comment tester, et un message de commit proposé.
6. L'utilisateur teste, commit/push lui-même, et peut transmettre les retours d'une review
   indépendante faite ailleurs.
7. Je corrige si besoin, puis j'attends le feu vert avant le lot suivant.

## Conventions à faire respecter dans les specs et en review

- JavaScript uniquement (pas de TypeScript).
- Pas de dépendances superflues : chaque nouvelle librairie doit être justifiée par un besoin
  réel du lot en cours.
- Aucun secret en dur dans le code (JWT_SECRET, URL de base) — toujours via variables
  d'environnement (Secrets Replit).
- Les données fictives des LOT-01 et LOT-02 doivent avoir EXACTEMENT la forme des réponses
  API définies dans le contrat d'API de `docs/SPECS.md`, pour que les lots backend n'aient
  qu'à remplacer le mock par un vrai appel réseau, sans changer les composants d'affichage.
- Chaque lot doit se terminer sur une application qui tourne de bout en bout (même avec des
  parties encore mockées), pour permettre un push à la fin de chaque lot.
- `docs/`, `CLAUDE.md` et `replit.md` sont hors périmètre de Replit Agent — je suis seul
  responsable de ces fichiers.

## Repères utiles

- Comptes de test : voir `docs/SPECS.md` section "Comptes de test".
- Contrat d'API complet : `docs/SPECS.md` section "Contrat d'API".
- Modèle de données : `docs/SPECS.md` section "Modèle de données".
