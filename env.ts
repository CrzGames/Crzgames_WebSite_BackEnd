/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(['local', 's3'] as const),
  NODE_ENV: Env.schema.enum(['development', 'test', 'staging', 'production'] as const),
  HASH_DRIVER: Env.schema.enum(['scrypt', 'bcrypt', 'argon'] as const),
  DB_CONNECTION: Env.schema.string(),
  MYSQL_HOST: Env.schema.string({ format: 'host' }),
  MYSQL_PORT: Env.schema.number(),
  MYSQL_USER: Env.schema.string(),
  MYSQL_PASSWORD: Env.schema.string(),
  MYSQL_DB_NAME: Env.schema.string(),
  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),
  MAILJET_API_SECRET_KEY: Env.schema.string(),
  MAILJET_API_KEY: Env.schema.string(),
  MAIJET_API_VERSION: Env.schema.string(),
  MAIL_TOKEN_VALID_MINUTES: Env.schema.number(),
  MAIL_USERNAME: Env.schema.string(),
  MAIL_LOGO_URL: Env.schema.string(),
  CACHE_VIEWS: Env.schema.boolean(),
  S3_KEY: Env.schema.string(),
  S3_SECRET_KEY: Env.schema.string(),
  S3_BUCKET: Env.schema.string(),
  S3_REGION: Env.schema.string(),
  S3_ENDPOINT: Env.schema.string(),
  S3_VISIBILITY: Env.schema.enum(['public', 'private'] as const),
  MULTIPART_FILE_TRANSFER_LIMIT_MB: Env.schema.string(),
  APP_BASE_URL: Env.schema.string(),
  APP_REDIRECT_URI_ACCOUNT_VALIDATE: Env.schema.string(),
  APP_REDIRECT_URI_TICKET_RESPONSE: Env.schema.string(),
  APP_REDIRECT_URI_FORGOT_PASSWORD: Env.schema.string(),
  APP_REDIRECT_URI_SEND_MAIL_TO_MODIFY_EMAIL: Env.schema.string(),
  NATS_SERVER: Env.schema.string(),
  NATS_NKEY_PUBLIC_KEY: Env.schema.string(),
  LOG_LEVEL: Env.schema.string(),
  DATABASE_DEBUG: Env.schema.boolean(),
  STRIPE_SECRET_KEY: Env.schema.string(),
  STRIPE_PUBLIC_KEY: Env.schema.string(),
  API_USER_TOKEN_EXPIRES_IN: Env.schema.string(),
  SWAGGER_AUTH_LOGIN: Env.schema.string(),
  SWAGGER_AUTH_PASSWORD: Env.schema.string(),
  STRIPE_WEBHOOK_SECRET: Env.schema.string(),
  SEATYRANTSxCRZGAMES_API_KEY_SECRET: Env.schema.string(),
})
