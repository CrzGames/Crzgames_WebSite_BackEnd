# First Stage: Build the App
FROM node:20.12.2 AS builder

WORKDIR /app

COPY package*.json .

# Install dependencies npm
RUN npm install -g npm@latest && npm install

COPY . .

# Build the application
RUN npm run build

# Second Stage: Setup the runtime
FROM node:20.12.2 AS runtime

WORKDIR /app

COPY --from=builder /app/build /app

COPY package*.json .

# Install production dependencies only
RUN npm ci --production --ignore-scripts

ENV NODE_ENV=production
ENV APP_BASE_URL=https://crzgames.com
ENV APP_REDIRECT_URI_ACCOUNT_VALIDATE=/account-validate?email=
ENV APP_REDIRECT_URI_TICKET_RESPONSE=/support/ticket/
ENV APP_REDIRECT_URI_FORGOT_PASSWORD=/reset-password?resetPasswordToken=
ENV APP_REDIRECT_URI_SEND_MAIL_TO_MODIFY_EMAIL=/reset-email?resetPasswordToken=
ENV NATS_SERVER=tls://crzcommon.com:4222
ENV APP_KEY=9-gIvZy9IbX5DD-aky_jQ3lQJVqHtS6F
ENV API_USER_TOKEN_EXPIRES_IN=1days
ENV DRIVE_DISK=s3
ENV HASH_DRIVER=scrypt
ENV CACHE_VIEWS=true
ENV HOST=0.0.0.0
ENV PORT=3333
ENV DB_CONNECTION=mysql
ENV MYSQL_DB_NAME=reco5282_crzgames_production
ENV MYSQL_HOST=109.234.165.225
ENV MYSQL_PASSWORD=jbq5zgn2puw@qnr.RUE
ENV MYSQL_PORT=3306
ENV MYSQL_USER=reco5282_all
ENV NATS_NKEY_PUBLIC_KEY=SUAKCAAEGY27V7DX37CVJSAEEAI3BMHAQU263KHIGELGRNB4T2D6AJSSKI
ENV NATS_SERVER=tls://nats.tcp.crzcommon.com
ENV MAIL_TOKEN_VALID_MINUTES=30
ENV MAIL_LOGO_URL=xx
ENV MAIL_USERNAME=support@crzgames.com
ENV MAILJET_API_SECRET_KEY=e4958d157190d1d62c253463590692de
ENV MAILJET_API_KEY=7bd86024d096359b34edda94063c9907
ENV MAIJET_API_VERSION=v3.1
ENV SMTP_HOST=none
ENV SMTP_PORT=1000
ENV SMTP_USERNAME=none
ENV SMTP_PASSWORD=none
ENV S3_KEY=crzgames
ENV S3_SECRET_KEY=Marylene59!!!
ENV S3_BUCKET=crzgames-public
ENV S3_REGION=none
ENV S3_ENDPOINT=https://s3.api.crzcommon.com
ENV S3_VISIBILITY=public
ENV MULTIPART_FILE_TRANSFER_LIMIT_MB=50000mb
ENV LOG_LEVEL=error
ENV DATABASE_DEBUG=false
ENV STRIPE_SECRET_KEY=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
ENV STRIPE_PUBLIC_KEY=pk_live_51Lyzi9GbxZzNJSYJYPpowKUJy9qYu9pm6aZNGtbspogUt5rqk6bEBrEETf6yxNrM3icuXPfOOeltbB6Co5DB3E2J00rLAF1fzN
ENV STRIPE_API_VERSION=2024-04-10
ENV SWAGGER_AUTH_LOGIN=crzgames
ENV SWAGGER_AUTH_PASSWORD=Marylene59!!!
ENV PROXY_CHECK_IO_API_KEY=85u814-b046n9-07z829-94637q
ENV STRIPE_WEBHOOK_SECRET=whsec_BGikNqowz0bP6UrtIpHyja6UOqkh1vuw
ENV SEATYRANTSxCRZGAMES_API_KEY_SECRET=2xbvu-EZ5g8viOREwy-MLmijeQEklsCBEZDSDDSDS

CMD npm run adonis:migration:run:staging-prod && \
    npm run adonis:db:seed && \
    node ./server.js
