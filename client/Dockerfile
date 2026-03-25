FROM node:20-alpine

WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier (pour le cache Docker)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code frontend
COPY . .

# Exposer le port de Vite
EXPOSE 5173

# Lancer Vite avec l'option --host pour écouter sur toutes les interfaces réseau du conteneur
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
