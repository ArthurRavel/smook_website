# 🏛️ Architecture Technique de Smook

Ce document détaille l'architecture complète du projet **Smook** : la structure des dossiers, les technologies utilisées, le fonctionnement des bases de données et des communications API, ainsi que l'infrastructure Docker.

---

## 1. Vue d'Ensemble de l'Application (Stack Technique)

Le projet "Smook" est une application dite **"Fullstack JS"**, c'est-à-dire que le code client (Frontend) et le code serveur (Backend) sont tous les deux écrits en JavaScript / Node.js.

### 🌐 Frontend (Dossier `/client`)
Le client est une Single Page Application (SPA).
*   **Framework Principal** : [React v18](https://react.dev/) via [Vite](https://vitejs.dev/) (Remplace "Create React App" car beaucoup plus rapide et moderne).
*   **Styling** : [Tailwind CSS v3](https://tailwindcss.com/) (Framework CSS utilitaire utilisé directement dans les attributs `className`).
*   **Routing** : `react-router-dom` (Permet de changer de page sans recharger le navigateur : `/`, `/carte`, `/admin`, `/login`).
*   **Icônes** : `lucide-react` (bibliothèque d'icônes SVG allégée).
*   **Animations** : Combinaison de classes Tailwind (`animate-fade-in`, etc.) et de fenêtres de viewport React (Intersection Observers dans `Home.jsx` et `Carte.jsx`).

### ⚙️ Backend (Dossier `/server`)
Le serveur est une API REST monolitique qui sert les données utiles au frontend.
*   **Environnement** : [Node.js](https://nodejs.org/) (version 20).
*   **Framework Web** : [Express.js](https://expressjs.com/) (Gère le routage des requêtes HTTP : GET, POST, PUT, DELETE).
*   **Authentification** : [JSON Web Tokens (JWT)](https://jwt.io/) pour sécuriser l'accès au panel admin (`jsonwebtoken`), + hachage des mots de passe en base avec `bcryptjs`.
*   **Gestion des variables secrètes** : `dotenv` (Permet de lire les clés depuis `.env`).

---

## 2. Infrastructure Cloud & Base de Données

Le projet n'enregistre aucune donnée structurée de manière locale pour s'adapter à un déploiement Cloud / Serverless (Render, Vercel, etc.). 

### 🗄️ PostgreSQL (Neon.tech)
Toute la logique de catalogue (produits, avis, catégories) est gérée par une base de données relationnelle **PostgreSQL**.
*   **Hébergement** : [Neon.tech](https://neon.tech/) (Base de données serverless dans le Cloud).
*   **Client DB Node.js** : le package NPM [`pg` (node-postgres)](https://node-postgres.com/). Le backend se connecte avec un `"Pool"` de connexions pour plus de performances.
*   **Le schéma (`database/schema.sql`)** :
    *   `users` : Administrateurs (nom, hash du mdp).
    *   `categories` : Les grandes familles (Café, Signatures, Food).
    *   `products` : Les produits liés via *foreign key* à la table catégorie. Un champ texte `ingredients` y est stocké au format tableau JSON `["Espresso", "Lait"]`.
    *   `badges` & `product_badges` : Tables pour associer finement plusieurs petits tags à un produit ("BIO", "VEGAN").
    *   `reviews` : Pour stocker les avis de la page d'accueil.

### 🖼️ Cloudinary (Upload de photos)
Render/Vercel sont des hébergeurs dits "éfémères" (le disque dur s'efface au redémarrage). L'enregistrement des photos ne se fait donc **pas** en local dans un dossier `/uploads`.
*   **L'outil d'upload** : Le package [`multer`](https://npmjs.com/package/multer) intercepte les requêtes `multipart/form-data` du panel admin.
*   **L'intégration Cloudinary** : Les images passent temporairement en mémoire via `multer.memoryStorage()` puis un flux (Stream) est envoyé et traité en temps réel par les serveurs distants de Cloudinary (grâce au package `cloudinary`). Une fois sur leurs serveurs distants, elles reçoivent une URL publique (`res.cloudinary.com/...`).

---

## 3. Communication Client - Serveur (L'API)

Le Frontend (React) et le Backend (Express) fonctionnent sur deux serveurs distincts durant le développement. 

*   React : `http://localhost:5173`
*   Express : `http://localhost:3000`

### 🔄 Le Proxy Vite
Pour éviter que l'API du navigateur bloque les requêtes pour des raisons de sécurité de domaines croisés (erreurs CORS restrictives), Vite agit comme un passeur de messages (Proxy) :
Si le composant React fait un `fetch('/api/products')`, il l'envoie techniquement au port 5173. 
Le fichier **`client/vite.config.js`** repère le chemin qui commence par `/api`, et s'occupe de renvoyer silencieusement cette requête vers `http://localhost:3000` (ou `http://server:3000` avec Docker). 

### 🔐 Authentification (Le flux de l'Admin)
1. L'utilisateur (admin) valide le form de `Login.jsx`. Une requête `POST /api/login` est envoyée.
2. Express récupère la demande, fait une requête en BDD via `pg` pour chercher le user "admin". Il hache le mot de passe fourni par l'utilisateur avec `bcrypt` et le compare au hachage récupéré de la BDD.
3. Si c'est un match, Express génère un "billet" numérique signé : **Le Token JWT**, qu'il renvoie à React.
4. React stocke ce Token le "LocalStorage" (la mémoire persistante du navigateur).
5. Chaque fois que l'admin est sur le panel et crée, supprime ou modifie un Produit, React rattache ce Token (`"Bearer eyJhbGc..."`) à l'En-tête (`Header`) exact de la requête.
6. Le Backend possède un "Middleware" (une fonction barrière `authenticateToken()`), qui lit le token de la requête. S'il est manquant ou faux, l'API répond `403 Forbidden` et bloque l'Upload / l'Insertion SQL.

---

## 4. Docker (L'Architecture de Conteneurisation)

Docker encapsule toute cette recette pour que l'application marche sur 100% des machines, peu importe leur configuration (Windows, mac, sans Node d'installé...).

Le projet utilise **`docker-compose.yml`** pour gérer 2 conteneurs : `smook_client` et `smook_server`.

1.   **Isolement** : Chaque service est une mini-"machine Linux" propre basée sur `node:20-alpine`, avec sa propre instance interne de Node.js.
2.   **Volumes** : Le fichier docker-compose stipule des `volumes`. Cela permet au code sur la machine de "réfléchir" au code dans le conteneur. Quand on enregistre `Home.jsx` sous Windows, React se met à jour instantanément à l'intérieur du conteneur grâce à "Chokidar" (un observateur de fichiers forcé en "Polling" via variables d'environnement pour qu'il ne bugue pas avec Windows WSL2).
3.   **Les variables d'environnement (`.env`)** : Injectées via le bloc `env_file: ./server/.env` , de manière sécurisée (C'est la seule chose qui n'est **jamais** mise sur Git, pour ne pas divulguer les bases de données Cloud).
4.   **Le réseau interne Docker** : Dans un cluster Docker, "localhost" redevient propre à chaque conteneur. Pour que le Frontend parle au Backend dans le cloud dockerisé de votre machine, il s'adresse à `http://server:3000` via la variable `VITE_API_TARGET` !
