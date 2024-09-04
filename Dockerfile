# Set version for specific version to O2Switch
FROM node:22.8.0

WORKDIR /app

COPY package*.json .

RUN npm install -g npm@latest && npm install

COPY . .

ENV CHOKIDAR_USEPOLLING=true

# Drop all tables, migrate, and run seeders AND run server
CMD npm run adonis:migration:fresh:develop && \
    npm run dev
