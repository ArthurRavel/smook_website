# Smook ☕

**Coffee shop healthy** — Site web pour un café-restaurant proposant des boissons artisanales et pâtisseries saines à Toulouse.

## 📋 Description

Smook est un site vitrine et une application de gestion pour un coffee shop toulousain. Le projet propose une approche "healthy" sans compromis sur le goût, et inclut un **Panel d'Administration sécurisé** pour gérer le catalogue en temps réel.

## 🚀 Fonctionnalités

### Site Public
- **Page d'accueil** : concept, produits en vedette, avis clients
- **La Carte** : catalogue complet organisé par catégories
- **Fiches Produits** : modales avec ingrédients, Nutriscore, badges (BIO, VEGAN)
- **Formulaire de contact**

### Administration (`/admin`)
- **Authentification** : connexion sécurisée via JWT
- **Dashboard CRUD** : ajout, modification, suppression de produits
- **Upload d'images** : stockage des photos via Cloudinary
- **Modifications en temps réel** sur la base de données

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + React Router |
| Styles | Tailwind CSS v3 (thème personnalisé) |
| Backend API | Node.js + Express |
| Base de données | PostgreSQL via [Neon](https://neon.tech/) |
| Stockage images | [Cloudinary](https://cloudinary.com/) |
| Auth | JWT + bcryptjs |
| Upload | Multer (mémoire) + Cloudinary SDK |

## 📂 Structure du projet

```
smook_website/
├── client/                     # FRONTEND (React + Vite)
│   ├── src/
│   │   ├── assets/             # Logos, images statiques
│   │   ├── components/         # Composants réutilisables
│   │   ├── pages/              # Home, Carte, Admin, Login
│   │   ├── App.jsx             # Routes React Router
│   │   └── index.css           # Tailwind + variables CSS
│   └── vite.config.js          # Proxy vers l'API + fix DNS
│
├── server/                     # BACKEND API (Express)
│   ├── server.js               # Toutes les routes API
│   ├── .env                    # Clés secrètes (NON versionné)
│   ├── .env.example            # Template des variables requises
│   └── package.json
│
└── database/
    └── schema.sql              # Script d'initialisation PostgreSQL
```

## 💾 Installation & Démarrage (Local)

### Prérequis
- Node.js v18+
- Un compte [Neon.tech](https://neon.tech/) (PostgreSQL gratuit)
- Un compte [Cloudinary](https://cloudinary.com/) (stockage images gratuit)

### 1. Configurer les variables d'environnement

Créez le fichier `server/.env` en copiant `server/.env.example` et remplissez les valeurs :

```env
PORT=3000
JWT_SECRET=votre_secret_jwt
DATABASE_URL=postgresql://...@neon.tech/neondb?sslmode=require
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

### 2. Initialiser la base de données (première fois seulement)

```bash
cd server
npm install
node -e "
  require('dotenv').config();
  const { Client } = require('pg');
  const fs = require('fs');
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  c.connect().then(() => c.query(fs.readFileSync('../database/schema.sql','utf8'))).then(() => { console.log('OK'); c.end(); });
"
```

### 3. Lancer le projet

**Terminal 1 — Backend** (dans `server/`) :
```bash
npm start
```

**Terminal 2 — Frontend** (dans `client/`) :
```bash
npm install  # première fois uniquement
npm run dev
```

Accédez au site sur `http://localhost:5173`

### 4. Accès Administrateur

- URL : `http://localhost:5173/admin` (redirige vers `/login`)
- **Identifiant par défaut** : `admin`
- **Mot de passe par défaut** : `password123`

> ⚠️ L'upload d'images nécessite un réseau sans firewall restrictif (pas les réseaux d'école). Le reste du site fonctionne partout.

## 🎨 Palette de Couleurs

| Nom | Code | Usage |
|-----|------|-------|
| Walnut | `#2c1e16` | Texte, header, boutons |
| Cream | `#f5dec9` | Accents, badges |
| Periwinkle | `#c8d6e5` | Hero, accents graphiques |
| Offwhite | `#fcfcfc` | Fond général |

## 🗺️ Feuille de route

- ✅ Interface React + Vite + Tailwind
- ✅ API Express + PostgreSQL (Neon)
- ✅ Authentification JWT + Panel Admin
- ✅ Upload d'images (Cloudinary)
- 📋 Déploiement (Render + Vercel)