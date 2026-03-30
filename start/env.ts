/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import '@foadonis/crypt'
import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'development-remote', 'staging', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  CACHE_VIEWS: Env.schema.boolean(),
  DB_CONNECTION: Env.schema.string(),
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string(),
  DB_DATABASE_NAME: Env.schema.string(),
  DB_DEBUG: Env.schema.boolean(),
  HEALTH: Env.schema.string(),
  MAIL_TOKEN_VALID_MINUTES: Env.schema.number(),
  API_USER_TOKEN_EXPIRATION: Env.schema.string(),
  API_USER_TOKEN_SECRET_LENGTH: Env.schema.number(),
  FRONTEND_APP_BASE_URL: Env.schema.string(),
  FRONTEND_APP_REDIRECT_URI_ACCOUNT_VALIDATE: Env.schema.string(),
  FRONTEND_APP_REDIRECT_URI_TICKET_RESPONSE: Env.schema.string(),
  FRONTEND_APP_REDIRECT_URI_FORGOT_PASSWORD: Env.schema.string(),
  FRONTEND_APP_REDIRECT_URI_SEND_MAIL_TO_MODIFY_EMAIL: Env.schema.string(),
  NATS_SERVER_URL: Env.schema.string(),
  NATS_NKEY_PRIVATE_KEY: Env.schema.string(),
  MULTIPART_FILE_TRANSFER_LIMIT_MB: Env.schema.number(),
  DRIVE_DISK: Env.schema.enum(['s3'] as const),
  S3_BUCKET_ACCESS_KEY_ID: Env.schema.string(),
  S3_BUCKET_SECRET_ACCESS_KEY: Env.schema.string(),
  S3_BUCKET_NAME: Env.schema.string(),
  S3_BUCKET_REGION: Env.schema.string(),
  S3_BUCKET_ENDPOINT: Env.schema.string(),
  S3_BUCKET_VISIBILITY: Env.schema.enum(['public', 'private'] as const),
  S3_BUCKET_FORCE_PATH_STYLE: Env.schema.boolean(),
  STRIPE_SECRET_KEY: Env.schema.string(),
  STRIPE_PUBLIC_KEY: Env.schema.string(),
  STRIPE_API_VERSION: Env.schema.string(),
  STRIPE_WEBHOOK_SECRET: Env.schema.string(),
  PROXY_CHECK_IO_API_KEY: Env.schema.string(),
  SEATYRANTSxCRZGAMES_API_KEY_SECRET: Env.schema.string(),
  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  MAIL_MAILER: Env.schema.enum(['smtp', 'resend'] as const),
  MAIL_FROM_NAME: Env.schema.string(),
  MAIL_FROM_ADDRESS: Env.schema.string(),
  RESEND_API_KEY: Env.schema.string(),
  SESSION_DRIVER: Env.schema.enum(['cookie', 'database', 'memory'] as const),
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
})
