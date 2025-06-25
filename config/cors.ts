import { defineConfig } from '@adonisjs/cors'

const allowedOrigins: string[] = [
  'http://localhost:1450',
  'http://127.0.0.1:1450',
  'https://dev.crzgames.com',
  'https://staging.crzgames.com',
  'https://crzgames.com',
]

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,
  origin: (origin: string) => {
    return allowedOrigins.includes(origin) // Autorise uniquement si l'origine est dans la liste
  },
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
