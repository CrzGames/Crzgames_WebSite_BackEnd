# Crzgames - Website - BackEnd

## 🛠 Tech Stack

- TypeScript (Language)
- Adonis (Framework backend)
- CI / CD (Github Actions)
- Docker / DockerCompose (Development-Local)
- Kubernetes (Development-Remote, Staging and Production)
- Unit / Functional Tests (Japa)
- MariaDB (Database)
- Mailer MailHog (Development-Local) and Mailer ReSend (Development-Remote, Staging and Production)

<br /><br />

---

<br /><br />

## 📚 Domains of different environments

- Development-Remote : https://dev.api.crzgames.com
- Staging : https://staging.api.crzgames.com
- Production : https://api.crzgames.com

<br /><br />

---

<br /><br />

## ⚙️ Setup Environment Development

1. Clone the project repository using the following commands :

```bash
git clone git@github.com:CrzGames/Crzgames_WebSite_BackEnd.git
```

2. Steps by Platform :

```bash
# Windows :
1. Requirements : Windows >= 10
2. Download and Install WSL2 : https://learn.microsoft.com/fr-fr/windows/wsl/install
3. Download and Install Docker Desktop : https://docs.docker.com/desktop/install/windows-install/

# macOS :
1. Requirements : macOS Intel x86_64 or macOS Apple Silicon arm64
2. Requirements (2) : macOS 11.0 (Big Sur) +
2. Download and Install Docker Desktop : https://docs.docker.com/desktop/install/mac-install/

# Linux (Ubuntu / Debian) :
1. Requirements : Ubuntu >= 20.04 or Debian >= 10
2. Download and Install Docker (Ubuntu) : https://docs.docker.com/engine/install/ubuntu/
3. Download and Install Docker (Debian) : https://docs.docker.com/engine/install/debian/
```

<br /><br />

---

<br /><br />

## 🔄 Cycle Development

1. Open Docker Desktop
2. Run command :

```bash
   # Start the development server on http://localhost:3555 (AdonisJS)
   # Start the development server on http://localhost:7450 (PhpMyAdmin)
   # Start the development server on http://localhost:8025 (Mailhog)
   # Start the development server on http://localhost:9001 (Minio S3 - UI)
   # Start the development server on http://localhost:900 (Minio S3 - API Endpoint)
   # Start MariaDB port is : 3310
   npm install # just for the idea
   npm run dev:docker
```

<br /><br />

---

<br /><br />

## 🔄 Unit / Functional Tests

### **General Tests:**

1. **Run all tests (unit and functional):**

   ```bash
   npm run test:all
   ```

2. **Run all tests with a watcher for changes:**
   ```bash
   npm run test:all:watch
   ```

<br />

### **Unit Tests:**

1. **Run only unit tests:**

   ```bash
   npm run test:unit
   ```

2. **Run unit tests with a watcher:**
   ```bash
   npm run test:unit:watch
   ```

<br />

### **Functional Tests:**

1. **Run only functional tests:**

   ```bash
   npm run test:functional
   ```

2. **Run functional tests with a watcher:**
   ```bash
   npm run test:functional:watch
   ```

<br /><br />

---

<br /><br />

## 🔑 **Gestion des Secrets d'Environnement**

Ce projet utilise le package `@foadonis/crypt` pour stocker et gérer de manière sécurisée les variables d'environnement.

### **Présentation des commandes :**

- `env:get:dev` : Déchiffre et affiche la valeur d'une variable d'environnement pour le `développement`.
- `env:get:dev-remote` : Déchiffre et affiche la valeur pour le `développement à distance`.
- `env:get:staging` : Déchiffre et affiche la valeur pour le `staging`.
- `env:get:prod` : Déchiffre et affiche la valeur pour la `production`.
- `env:get:test` : Déchiffre et affiche la valeur pour les `tests`.

<br />

- `env:set:dev` : Chiffre et stocke une nouvelle variable dans `.env.development`.
- `env:set:dev-remote` : Chiffre et stocke une nouvelle variable dans `.env.development-remote`.
- `env:set:staging` : Chiffre et stocke une nouvelle variable dans `.env.staging`.
- `env:set:prod` : Chiffre et stocke une nouvelle variable dans `.env.production`.
- `env:set:test` : Chiffre et stocke une nouvelle variable dans `.env.test`.

### **Utilisation des commandes :**

1. **Déchiffrer une variable d'environnement :**
   Utilisez les scripts npm suivants en fonction de l'environnement désiré :

   ```bash
   # .env
   npm run env:get:dev -- <VARIABLE_NAME>

   # .env.development-remote
   npm run env:get:dev-remote -- <VARIABLE_NAME>

   # .env.staging
   npm run env:get:staging -- <VARIABLE_NAME>

   # .env.prod
   npm run env:get:prod -- <VARIABLE_NAME>

   # .env.test
   npm run env:get:test -- <VARIABLE_NAME>
   ```

2. **Chiffrer et stocker une nouvelle variable d'environnement :**
   Utilisez les scripts npm suivants en fonction de l'environnement désiré :

   ```bash
   # .env
   npm run env:set:dev -- <VARIABLE_NAME> "<VALUE>"

   # .env.development-remote
   npm run env:set:dev-remote -- <VARIABLE_NAME> "<VALUE>"

   # .env.staging
   npm run env:set:staging -- <VARIABLE_NAME> "<VALUE>"

   # .env.prod
   npm run env:set:prod -- <VARIABLE_NAME> "<VALUE>"

   # .env.test
   npm run env:set:test -- <VARIABLE_NAME> "<VALUE>"
   ```

### **Gestion des fichiers versionnés et non versionnés :**

- Les fichiers **`.env` et `.env.*`** contenant des variables chiffrées peuvent être versionnés.
- Le fichier **`.env.keys`** contenant les clés privées de déchiffrement ne doit jamais être versionné.
- Un fichier **`.env.keys.example`** est fourni pour montrer la structure des clés, sans valeurs réelles.

### **Accès sécurisé aux clés :**

Les clés privées réelles sont stockées de manière sécurisée dans **1Password**, dans le coffre nommé **`.env.keys (Flapi - AdonisJS)`**.

<br /><br />

---

<br /><br />

## 🚀 Production

### ⚙️➡️ Automatic Distribution Process (CI / CD)

#### Si c'est un nouveau projet suivez les instructions :

1. Ajoutées les SECRETS_GITHUB pour :
   - DOCKER_HUB_USERNAME
   - DOCKER_HUB_ACCESS_TOKEN
   - KUBECONFIG
   - PAT_TOKEN (crée un nouveau token si besoin sur le site de github puis dans le menu du "Profil" puis -> "Settings" -> "Developper Settings' -> 'Personnal Access Tokens' -> Tokens (classic))
