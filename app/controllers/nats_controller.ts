import type { HttpContext } from '@adonisjs/core/http'

/**
 *
 */
export default class NatsController {
  /**
   *
   */
  public publish({ response, request }: HttpContext): void {
    request.only(['message', 'subject'])

    try {
      // await NatsService.publish(_data.subject, _data.message)
      response.send('Connexion drainee avec succes + Publish subject and message.')
    } catch (error) {
      response.send(`Erreur lors de la connexion a NATS: ${error}`)
    }
  }

  /**
   *
   */
  public subscribe({ response, request }: HttpContext): void {
    request.only(['subject'])

    try {
      // await NatsService.subscribe(_subject.subject)
      response.send('Connexion drainee avec succes + Subscribe publication.')
    } catch (error) {
      response.send(`Erreur lors de la connexion a NATS: ${error}`)
    }
  }
}
