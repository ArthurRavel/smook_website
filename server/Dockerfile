FROM node:20-alpine

WORKDIR /app

# Copier les dépendances en premier pour optimiser le cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code backend
COPY . .

# Exposer le port du serveur Node.js
EXPOSE 3000

# Lancer le serveur (assurez-vous d'avoir 'start': 'node server.js' ou équivalent dans package.json)
CMD ["npm", "start"]
