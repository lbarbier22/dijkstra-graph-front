# 🧠 Visualisation de l'algorithme de Dijkstra 🚀
 
# Bienvenue dans ce projet interactif permettant de **visualiser le célèbre algorithme de Dijkstra** 🗺️✨
 
## 🔍 C'est quoi Dijkstra ?
 
L'algorithme de Dijkstra est une méthode utilisée pour trouver **le chemin le plus court** entre deux nœuds dans un graphe pondéré (où chaque lien a un "coût").
 
👣 Étapes principales :
1. Le nœud de départ est initialisé avec une distance de 0.
2. Tous les autres nœuds sont initialisés à l'infini.
3. On explore les voisins du nœud courant et on met à jour leur distance si un chemin plus court est trouvé.
4. On répète jusqu'à avoir atteint le nœud final.
 
🔗 Utile pour : GPS, réseaux, jeux vidéo, IA, etc.
 
---
 
## 🖥️ Démarrage du projet
 
### 🛠️ Prérequis
 
- Node.js (v18+ recommandé)
- npm ou yarn
 
### 📦 Installation
 
```bash
npm install
# ou
yarn install
```
 
### 🚀 Lancer l'application
 
```bash
npm run dev
# ou
yarn dev
```
 
Ensuite, rendez-vous sur [http://localhost:5173](http://localhost:5173)
 
---
 
## 🧩 Fonctionnalités
 
✅ Génération automatique ou manuelle d’un graphe  
✅ Sélection du point de départ 🟢, d'arrivée 🔴 et étapes 🟠  
✅ Visualisation du plus court chemin avec poids  
✅ Import personnalisé de GeoJSON  
✅ Design interactif avec Cytoscape.js
 
---
 
## 📁 Structure du projet
 
```
src/
├── components/         # Composants Vue
├── assets/             # Styles & JSON
├── utils/              # Fonctions de traitement (API, parsing, etc.)
├── test/               # Tests unitaires
```
 
---
 
## 🧪 Tests
 
Lancer tous les tests avec :
 
```bash
npm run test
```
 
Les tests utilisent **Vitest** pour le front et **Supertest** pour le backend.
 
---
 
## 🛠️ Backend
 
Le serveur Node.js fournit :
- `/api/graph` : récupération du graphe actuel
- `/api/graph/random` : génération aléatoire d’un graphe
- `/api/dijkstra` : exécution de l'algorithme
 
⚙️ Backend à démarrer avec :
 
```bash
npm run start
```
 
---
 
## ❤️ Crédits
 
Développé avec Vue 3, Vite, Node.js, Express, Cytoscape.js, et beaucoup d’amour 💚  
Contributions, feedbacks et étoiles ⭐ sont les bienvenus !
