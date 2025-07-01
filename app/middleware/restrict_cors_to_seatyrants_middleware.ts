import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

/**
 * Middleware pour permettre de restreindre les requêtes HTTP uniquement
 * si elles proviennent du backend SeaTyrants.
 * Ce middleware vérifie la clé API dans l'en-tête de la requête (X-API-KEY).
 */
export default class RestrictCorsToSeaTyrantsMiddleware {
  /**
   * Gère la requête entrante et vérifie la clé API.
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {Function} next - The next middleware function
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async handle({ request, response }: HttpContext, next: () => Promise<void>): Promise<void> {
    if (env.get('NODE_ENV') === 'test' || env.get('NODE_ENV') === 'development') {
      // Si la variable d'environnement NODE_ENV est 'test' ou 'development', on passe au middleware suivant ou au contrôleur
      await next()
      return
    }

    const apiKey: string | undefined = request.header('X-API-KEY')
    const apiKeySecret: string = env.get('SEATYRANTSxCRZGAMES_API_KEY_SECRET')
    if (apiKey !== apiKeySecret) {
      return response.unauthorized({ message: 'Unauthorized request. Invalid API key.' })
    }

    // Si la clé API est valide, passe au middleware suivant ou au contrôleur
    await next()
  }
}
