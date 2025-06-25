import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

/**
 * Middleware to restrict CORS to SeaTyrants
 * Permet de restreindre les requêtes CORS à SeaTyrants
 * en vérifiant la clé API dans l'en-tête de la requête.
 */
export default class RestrictCorsToSeaTyrantsMiddleware {
  /**
   * Handle the incoming request and check the API key.
   * Gère la requête entrante et vérifie la clé API.
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {Function} next - The next middleware function
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async handle({ request, response }: HttpContext, next: () => Promise<void>): Promise<void> {
    if (env.get('NODE_ENV') === 'test' || env.get('NODE_ENV') === 'development') {
      await next()
      return
    }

    const apiKey: string | undefined = request.header('X-API-KEY')
    const apiKeySecret: string = env.get('SEATYRANTSxCRZGAMES_API_KEY_SECRET')

    if (apiKey !== apiKeySecret) {
      response.status(401).send('Unauthorized')
      return
    }

    await next()
  }
}
