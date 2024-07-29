# Crzgames - WebSite / Back-end

## <span style="color: green;">Git - Branch protected</span>

### Branch - Develop (development) :

1. On ne peux pas push sur la branche 'develop', il faut créer une branche à partir de 'develop' pour ça feature, puis faire une pull request (PR) sur 'develop' par rapport à ça feature finaliser qui ce trouve dans ça branche.

### Branch - Staging (pré-production) :

1. La branche 'staging' est en lecture seul, mais possible de faire une pull request (PR) sur 'staging' par rapport à la branche 'develop'.

### Branch - Main (production) :

1. La branche 'main' est en lecture seul et n'y faire de pull requests (PR), c'est moi-même qui me chargera de la pousser vers la production lorsqu'une nouvelle mise à jour doit être déployer.

<br /><br /><br /><br />

## <span style="color: green;">Plateform / Environment</span>

### Development :

Informations : Version courante en cours de développement dans un environnement local.

1. Crzgames_WebSite_BackEnd : http://localhost:3333
2. Mail : http://localhost:8025
3. Database : crzgames_develop (http://localhost:8080)

### Staging :

Informations : Version courante en cours de développement mais dans un environnement de production.

1. Crzgames_WebSite_BackEnd : https://staging.api.crzgames.com/
2. Mail : https://pull.o2switch.net:2096/cpsess7262222002/3rdparty/roundcube/index.php?_task=mail&_mbox=INBOX
3. Database : juhx9414_crzgames_staging (https://pull.o2switch.net:2083/cpsess5812475707/3rdparty/phpMyAdmin/index.php)

### Production :

Informations : Version latest Release

1. Crzgames_WebSite_BackEnd : https://api.crzgames.com/
2. Mail : https://pull.o2switch.net:2096/cpsess7262222002/3rdparty/roundcube/index.php?_task=mail&_mbox=INBOX
3. Database : juhx9414_crzgames (https://pull.o2switch.net:2083/cpsess5812475707/3rdparty/phpMyAdmin/index.php)

<br /><br /><br /><br />

## <span style="color: green;">Versioning</span>

This library (release-please) follows [Semantic Versioning](http://semver.org/).

<br /><br /><br /><br />

## <span style="color: green;">New Release - Production</span>

1. Go in branch 'develop' :

```bash
git checkout develop
git pull origin develop
```

2. Fusionnez la branche develop dans la branche de pré-production (staging) :

```bash
git checkout staging
git merge develop
git push origin staging
```

3. Effectuez les tests et les validations nécessaires dans l'environnement de staging.
4. Lorsque la version est validée, fusionnez la branche de pré-production (staging) dans la branche de production (main) pour publier la version finale :

```bash
# L'option --no-ff garantit qu'un commit de fusion est créé lors de la fusion.
# Ce qui aide à garder un historique clair de toutes les fusions effectuées.

git checkout main
git merge staging
git push origin main

# Lance la CI / CD auto lorsque c'est push sur main
```

<br /><br /><br /><br />

## <span style="color: green;">New Feature - Development</span>

### New Feature :

1. Go in branch 'develop' :

```bash
git checkout develop
git pull origin develop
```

2. Create a new branche for new feature :

```bash
# Create new branch and switch branch (local branch)
git checkout -b feature/my-feature # docs/my-docs, fix/my-bug...

# Push new branch in repository distant
git push --set-upstream origin feature/my-feature
```

### Finish Feature :

1. Create 'Pull request' go in repository : https://github.com/corentin35000/Crzgames_WebSite_BackEnd/pulls
2. 'base: develop' <-- 'compare: feature/my-feature'
3. Assign 'Corentin Recanzone' for 'Pull request'
4. Go create Pull requests.

<br /><br /><br /><br />

## <span style="color: green;">Git - Branch and Commit</span>

### Liens utiles :

1. Conventional Commits : https://www.conventionalcommits.org/en/v1.0.0/
2. Workflow Branch : https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow

<br />

### Lors d'un nouveau Commit :

BREAKING CHANGES (!) :

- feat!: my commit
- ...
  <br /><br />

NO BREAKING CHANGES:

- fix: Une modification qui corrige un bug. <br /> Par exemple? "fix: correct minor typos in code".
  <br /><br />

- feat: Une nouvelle fonctionnalité. <br /> Par exemple, "feat: add new 'forgot password' feature".
  <br /><br />

- chore: Les tâches de maintenance régulières ou les tâches qui ne modifient pas le code source, comme les mises à jour du build process ou les modifications aux fichiers de documentation. <br /> Par exemple, "chore: update build script".
  <br /><br />

- docs: Des modifications apportées uniquement à la documentation. <br /> Par exemple, "docs: add usage section to README".
  <br /><br />

- style: Les modifications qui n'affectent pas le sens du code (blancs, mise en forme, point-virgule manquants, etc). <br /> Par exemple, "style: format code as per prettier".
  <br /><br />

- refactor: Une modification du code qui n'ajoute aucune nouvelle fonctionnalité ni ne corrige de bug. <br /> Par exemple, "refactor: restructure project directory layout".
  <br /><br />

- perf: Une modification du code qui améliore les performances. <br /> Par exemple, "perf: improve user login speed".
  <br /><br />

- test: Ajout ou modification de tests. <br /> Par exemple, "test: add unit test for user login".
  <br /><br />

- build: Modifications qui affectent le système de build, ou des dépendances externes. <br /> Par exemple, "build: upgrade webpack to version 5".
  <br /><br />

- ci: Modifications aux fichiers et scripts d'intégration continue.

<br />

### Lors d'une nouvelle Branche (in develop) :

Utiliser toujours le nommage des branches comme cela :

- 'feature/my-feature'
- 'fix/my-bug'
- 'docs/my-docs'
- ...

<br />

### Branches importantes :

Concernant les branches important : develop, staging (pré-production), main (production)

<br /><br /><br /><br />

## <span style="color: green;">RoadMap - Features / Issues</span>

### Features :

Pour voir les Features, ou créer un ticket directement depuis le repository dans la page 'Projects' : [https://github.com/users/corentin35000/projects/13](https://github.com/users/corentin35000/projects/13)

### Issues :

Pour voir les Issues (bugs), ou créer un ticket directement depuis le repository dans la page 'Issues' : [https://github.com/corentin35000/Crzgames_WebSite_BackEnd/issues/new](https://github.com/corentin35000/Crzgames_WebSite_BackEnd/issues/new)

<br /><br /><br /><br />

## <span style="color: green;">Swagger</span>

### New Route :

Pour chaque nouvelle 'Route' il faudra créer un fichier .yml pour swagger, depuis './docs/swagger/controllers'

### New Model :

Pour chaque nouveau 'Model' il faudra créer un fichier .yml pour swagger, depuis './docs/swagger/models'

<br /><br /><br /><br />
