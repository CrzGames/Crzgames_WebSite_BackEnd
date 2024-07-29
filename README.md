# Crzgames - WebSite / Back-end

## <span style="color: green;">🛠 Tech Stack</span>

- AdonisJS (framework back-end)
- NodeJS (environnement)
- MariaDB (database)
- Japa (tests unitaire/functional)
- MinIO (CloudStorageS3)
- Mailhog (MailDev)
- PHPMyAdmin (Dashboard web database)
- CI / CD (Github actions)
- Docker / DockerCompose (Development)
- Kubernetes (Staging / Production)
- https://proxycheck.io/dashboard/ ProxyCheck.io (API)

<br /><br /><br /><br />


## <span style="color: green;">Setup Environment</span>
1. Download and Install Docker Desktop : https://www.docker.com/products/docker-desktop/


<br /><br /><br /><br />


## <span style="color: green;">Cycle Development</span>
1. Open Docker Desktop
2. Run command :
```bash
   # Start the development server on http://localhost:3333 (AdonisJS)
   # Start the development server on http://localhost:8080 (phpmyadmin)
   # Start the development server on http://localhost:9001 (MinIO - CloudStorageS3 / Dashboard Web)
   # Start the development server on http://localhost:9000 (MinIO - CloudStorageS3 / API)
   # Start the development server on http://localhost:8025 (Mailhog)
   # Start MariaDB port is : 3306

   docker-compose up
```

<br /><br /><br /><br />


## <span style="color: green">Unit / Functional Tests</span>
### Development :
```sh
# npm
npm run test:dev
```

### Test/Staging/Production :
```sh
# npm
npm run test:staging-prod
```

<br /><br /><br /><br />


## <span style="color: green;">Production</span>
### Automatic - Pipeline CI/CD :
#### Setup - Si cela n'as jamais était encore fait :
