# SPECS — Application de gestion de commandes restaurant

Ce document est la référence unique pour ce que l'application doit faire. Il est géré par
l'architecte du projet (Claude Code). Replit Agent ne doit pas le modifier.

## 1. Rôles et permissions

| Rôle    | Peut faire |
|---------|------------|
| `client`  | Consulter le menu, gérer son panier, passer une commande, voir l'historique et le statut de ses propres commandes. |
| `staff`   | Voir toutes les commandes des clients (dashboard), changer le statut d'une commande. Ne gère pas le menu ni les comptes. |
| `admin`   | Gérer le menu (créer/modifier/supprimer des articles, catégories, prix). Gérer les comptes staff (créer/modifier/supprimer). N'intervient pas sur les commandes. |

Un utilisateur n'a qu'un seul rôle. Il n'y a pas d'inscription libre : les comptes sont créés
par seed (client, staff, admin) ou, pour les comptes staff, via l'interface admin (données
fictives jusqu'à la fin des 5 lots — voir plus bas).

Toutes les routes API protégées exigent un JWT valide envoyé dans le header
`Authorization: Bearer <token>`. Une route protégée par rôle renvoie `403` si le rôle du
token ne correspond pas.

## 2. Écrans par rôle

### Client

- **Connexion** (`/login`) : formulaire email + mot de passe. Redirige vers `/menu` après
  connexion réussie.
- **Menu** (`/menu`) : liste des articles disponibles, groupés par catégorie. Chaque article
  affiche nom, description, prix, et un bouton "Ajouter au panier" (avec sélecteur de
  quantité). Un indicateur du nombre d'articles dans le panier est visible en permanence
  (ex : dans un header).
- **Panier** (`/panier`) : liste des articles ajoutés avec quantité modifiable et bouton de
  suppression par ligne, total général, bouton "Valider la commande". Panier vide → message
  + lien vers le menu.
- **Mes commandes** (`/mes-commandes`) : liste des commandes du client, plus récente en
  premier, avec pour chacune : date, articles + quantités, total, badge de statut coloré
  (Reçue / En préparation / Prête).

### Staff

- **Connexion** : même écran que le client, redirige vers `/staff` selon le rôle.
- **Dashboard** (`/staff`) : liste de toutes les commandes de tous les clients, plus récente
  en premier (ou triée par statut), avec pour chacune : numéro/date, nom du client, articles
  + quantités, total, statut actuel, et un bouton pour faire avancer le statut à l'étape
  suivante (Reçue → En préparation → Prête). Pas de bouton pour une commande déjà "Prête".

### Admin

- **Connexion** : même écran, redirige vers `/admin` selon le rôle.
- **Gestion du menu** (`/admin/menu`) : tableau des articles (nom, catégorie, prix,
  disponibilité), avec formulaire d'ajout et actions modifier/supprimer par ligne.
- **Gestion du staff** (`/admin/staff`) : tableau des comptes staff (nom, email), avec
  formulaire d'ajout et action supprimer par ligne.

L'admin reste entièrement en données fictives (mock côté frontend, sans appel API) jusqu'à
la fin des 5 lots prévus. Aucun endpoint backend n'est prévu pour l'admin dans ce périmètre.

## 3. Parcours utilisateur

**Client — commander :**
1. Se connecte sur `/login`.
2. Est redirigé vers `/menu`.
3. Ajoute un ou plusieurs articles au panier (avec quantités).
4. Va sur `/panier`, vérifie/ajuste les quantités.
5. Clique sur "Valider la commande".
6. Est redirigé vers `/mes-commandes`, voit sa nouvelle commande avec le statut "Reçue".
7. Revient plus tard sur `/mes-commandes` (ou la page se rafraîchit automatiquement) et voit
   le statut évoluer au fur et à mesure que le staff la traite.

**Staff — traiter une commande :**
1. Se connecte, arrive sur `/staff`.
2. Voit une nouvelle commande au statut "Reçue".
3. Clique sur "Démarrer la préparation" → statut passe à "En préparation".
4. Clique sur "Marquer prête" → statut passe à "Prête".

**Admin — gérer le menu :**
1. Se connecte, arrive sur `/admin/menu`.
2. Ajoute un nouvel article via le formulaire (nom, description, prix, catégorie).
3. L'article apparaît dans le tableau (données fictives, non persistées côté serveur).

## 4. Modèle de données

### `users`
| Colonne | Type | Notes |
|---|---|---|
| id | serial PK | |
| name | text | |
| email | text unique | |
| password_hash | text | bcrypt |
| role | text | `client` \| `staff` \| `admin` |
| created_at | timestamptz | défaut `now()` |

### `menu_items`
| Colonne | Type | Notes |
|---|---|---|
| id | serial PK | |
| name | text | |
| description | text | nullable |
| price | numeric(10,2) | en euros |
| category | text | ex : "Entrées", "Plats", "Desserts", "Boissons" |
| image_url | text | nullable |
| is_available | boolean | défaut `true` |
| created_at | timestamptz | défaut `now()` |

### `orders`
| Colonne | Type | Notes |
|---|---|---|
| id | serial PK | |
| user_id | integer FK → users.id | |
| status | text | `recue` \| `en_preparation` \| `prete` — défaut `recue` |
| total | numeric(10,2) | calculé serveur, somme des order_items |
| created_at | timestamptz | défaut `now()` |
| updated_at | timestamptz | défaut `now()`, mis à jour au changement de statut |

### `order_items`
| Colonne | Type | Notes |
|---|---|---|
| id | serial PK | |
| order_id | integer FK → orders.id | |
| menu_item_id | integer FK → menu_items.id | |
| name | text | copie du nom au moment de la commande (snapshot) |
| price | numeric(10,2) | copie du prix au moment de la commande (snapshot) |
| quantity | integer | |

Les colonnes `name`/`price` sont dupliquées dans `order_items` pour que l'historique d'une
commande reste correct même si un article de menu change de prix ou est supprimé plus tard.

Transitions de statut valides pour `orders.status` : `recue` → `en_preparation` →
`prete`, dans cet ordre uniquement. Aucun retour en arrière, aucun saut d'étape.

## 5. Contrat d'API

Toutes les réponses sont en JSON. Toutes les erreurs renvoient `{ "error": "message" }`
avec un code HTTP approprié (400, 401, 403, 404, 500).

Toutes les routes sauf `POST /api/auth/login` exigent le header
`Authorization: Bearer <token>`. Un token absent ou invalide renvoie `401`.

### Auth

**`POST /api/auth/login`** — public
Body :
```json
{ "email": "client@test.com", "password": "client123" }
```
Réponse `200` :
```json
{
  "token": "eyJ...",
  "user": { "id": 1, "name": "Amine Client", "email": "client@test.com", "role": "client" }
}
```
Erreur `401` si email/mot de passe invalide : `{ "error": "Identifiants invalides" }`.

**`GET /api/auth/me`** — tout rôle authentifié
Réponse `200` :
```json
{ "user": { "id": 1, "name": "Amine Client", "email": "client@test.com", "role": "client" } }
```

### Menu

**`GET /api/menu`** — tout rôle authentifié
Réponse `200` :
```json
[
  {
    "id": 1,
    "name": "Pizza Margherita",
    "description": "Tomate, mozzarella, basilic",
    "price": 9.50,
    "category": "Plats",
    "imageUrl": null,
    "isAvailable": true
  }
]
```

### Commandes

**`POST /api/orders`** — rôle `client`
Body :
```json
{
  "items": [
    { "menuItemId": 1, "quantity": 2 },
    { "menuItemId": 3, "quantity": 1 }
  ]
}
```
Réponse `201` :
```json
{
  "id": 12,
  "status": "recue",
  "total": 28.50,
  "createdAt": "2026-09-25T10:00:00.000Z",
  "items": [
    { "menuItemId": 1, "name": "Pizza Margherita", "price": 9.50, "quantity": 2 },
    { "menuItemId": 3, "name": "Tiramisu", "price": 9.50, "quantity": 1 }
  ]
}
```
Le prix et le total sont recalculés côté serveur à partir de `menu_items` (jamais confiance
dans un prix envoyé par le client). Erreur `400` si `items` est vide ou si un `menuItemId`
n'existe pas / n'est pas disponible.

**`GET /api/orders/mine`** — rôle `client`
Réponse `200` : liste des commandes du client connecté, plus récente en premier, même forme
d'objet que la réponse de `POST /api/orders`.

**`GET /api/orders`** — rôle `staff`
Réponse `200` : liste de toutes les commandes, tous clients, plus récente en premier. Chaque
commande inclut en plus `customerName` :
```json
[
  {
    "id": 12,
    "status": "recue",
    "total": 28.50,
    "createdAt": "2026-09-25T10:00:00.000Z",
    "customerName": "Amine Client",
    "items": [ { "menuItemId": 1, "name": "Pizza Margherita", "price": 9.50, "quantity": 2 } ]
  }
]
```

**`PATCH /api/orders/:id/status`** — rôle `staff`
Body :
```json
{ "status": "en_preparation" }
```
Réponse `200` : la commande mise à jour (même forme que ci-dessus). Erreur `400` si la
transition demandée n'est pas la prochaine étape valide (ex : passer de `recue` directement
à `prete`). Erreur `404` si la commande n'existe pas.

## 6. Comptes de test

Créés par le script de seed backend (LOT-03). Utilisés aussi comme référence pour les
données fictives des LOT-01/LOT-02 (login mock).

| Rôle | Email | Mot de passe |
|---|---|---|
| client | `client@test.com` | `client123` |
| staff | `staff@test.com` | `staff123` |
| admin | `admin@test.com` | `admin123` |

## 7. Découpage en lots

Voir `docs/ROADMAP.md` pour le statut, et `docs/lots/LOT-0X.md` pour le détail de chaque lot.

1. **LOT-01** — Structure du projet, connexion mock, interfaces client (menu, panier, mes
   commandes) en données fictives.
2. **LOT-02** — Interfaces staff (dashboard) et admin (gestion menu + staff) en données
   fictives.
3. **LOT-03** — Backend d'authentification réel (JWT, rôles, seed, redirection par rôle).
4. **LOT-04** — Backend commande client (menu en base, création de commande, historique).
5. **LOT-05** — Backend dashboard staff (liste des commandes, changement de statut, visible
   côté client).
