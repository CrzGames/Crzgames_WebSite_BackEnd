import type { HttpContext } from '@adonisjs/core/http'
import Env from '@ioc:Adonis/Core/Env'

export default class RestrictCorsToSeaTyrantsMiddleware {
  async handle({ request, response }: HttpContext, next: () => Promise<void>): Promise<void> {
    if (Env.get('NODE_ENV') === 'test' || Env.get('NODE_ENV') === 'development') {
      await next()
      return
    }

    const apiKey: string | undefined = request.header('X-API-KEY')
    const apiKeySecret: string = Env.get('SEATYRANTSxCRZGAMES_API_KEY_SECRET')

    if (apiKey !== apiKeySecret) {
      response.status(401).send('Unauthorized')
      return
    }

    await next()
  }
}
