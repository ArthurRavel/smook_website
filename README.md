# Smook ☕

**Coffee shop healthy** — Site web pour un café-restaurant proposant des boissons artisanales et pâtisseries saines à Toulouse.

## 📋 Description

Smook est un site vitrine pour un projet de coffee shop toulousain lancé en 2025, proposant une approche healthy sans compromis sur le goût. Le site présente la carte complète des produits avec des informations nutritionnelles détaillées et des badges (BIO, VEGAN, etc.).

## 🚀 Fonctionnalités

- **Page d'accueil** : présentation du concept, produits en vedette, avis clients
- **Carte complète** : catalogue de tous les produits organisés par catégories (Café de spécialité, Signatures, Food)
- **Fiches produits interactives** : modale avec détails (ingrédients, nutriscore, badges)
- **Base de données** : stockage structuré des produits, catégories, badges et avis
- **Design responsive** : adaptation mobile et desktop

## 🛠️ Technologies

- **Frontend** : HTML5, CSS3, JavaScript vanilla
- **Base de données** : MySQL
- **Structure** : Architecture statique (à connecter dynamiquement)

## 📁 Structure du projet

```
smook_website/
├── public/                    # Frontend (servi par Express)
│   ├── index.html             # Page d'accueil
│   ├── carte.html             # Page de la carte complète
│   ├── css/
│   │   └── style.css          # Styles globaux
│   ├── js/
│   │   └── script.js          # Scripts et interactivité
│   └── img/                   # Logos et images
│       ├── Logo 1.svg/png     # Logo (periwinkle — fond sombre)
│       ├── Logo 2.svg/png     # Logo (cream — fond clair)
│       ├── Logo 4.svg/png     # Logo variante
│       └── Logo 5.svg/png     # Logo variante
├── database/                  # Base de données
│   ├── schema.sql             # Schéma + données initiales
│   └── MCD.png                # Modèle Conceptuel de Données
├── docs/                      # Documentation & design
│   ├── maquette/              # Maquettes wireframe
│   └── Couleurs.png           # Palette de couleurs
├── server.js                  # Serveur Express + API REST
├── package.json               # Dépendances Node.js
├── TODO.md                    # Feuille de route
└── README.md                  # Ce fichier
```


## 💾 Installation

### 1. Base de données

```bash
# Importer le schéma de la base de données
mysql -u votre_utilisateur -p < database/schema.sql
```

Le schéma crée automatiquement la base `smook_db` avec les tables :
- `categories` : Catégories de produits
- `products` : Catalogue des produits
- `badges` : Labels (BIO, VEGAN, etc.)
- `product_badges` : Liaison produits-badges
- `reviews` : Avis clients

### 2. Site web

Ouvrez simplement les fichiers HTML dans un navigateur ou utilisez un serveur local :

```bash
# Avec Python
cd site
python3 -m http.server 8000

# Avec Node.js (npx)
npx http-server site -p 8000
```

Accédez au site sur `http://localhost:8000`

## 🗺️ Feuille de route

Consultez [TODO.md](TODO.md) pour la liste complète des tâches à venir :

- ✅ Interface utilisateur de base
- ✅ Schéma de base de données produits
- 🔄 Refonte de la mise en page selon la direction artistique
- 🔄 Mise en production de la base de données
- 🔄 Connexion dynamique backend (affichage depuis la base)
- 📋 Base de données utilisateurs
- 📋 Panneau d'administration

## 🎨 Design

Le design suit une approche minimaliste et moderne avec :
- Typographie bold et claire
- Palette de couleurs neutres (gris, noir, blanc)
- Nutriscore visuel pour chaque produit
- Badges visuels pour les labels
- Interface épurée et accessible

## 📝 Utilisation

### Navigation
- Page d'accueil : présentation générale et produits vedettes
- Carte : catalogue complet organisé par catégories
- Clic sur un produit : ouverture d'une modale avec détails complets

### Catégories disponibles
- **Café de spécialité** : Espresso, Cappuccino, Flat White, etc.
- **Signatures** : Créations maison originales
- **Food** : Pâtisseries et encas sains

## 🔧 Développement

### Prochaines étapes techniques

1. **Backend** : Développer l'API pour connecter le frontend à la base de données
2. **Gestion utilisateurs** : Système d'authentification et de comptes
3. **Panel admin** : Interface de gestion des produits sans toucher au code
4. **Déploiement** : Mise en production sur un hébergement web