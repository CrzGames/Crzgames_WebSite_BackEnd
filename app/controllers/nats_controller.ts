import type { HttpContext } from '@adonisjs/core/http'

export default class NatsController {
  public async publish({ response, request }: HttpContext): Promise<void> {
    const data = request.only(['message', 'subject'])

    try {
      //await NatsService.publish(data.subject, data.message)
      response.send('Connexion drainée avec succès + Publish subject and message.')
    } catch (error) {
      response.send('Erreur lors de la connexion à NATS: ' + error)
    }
  }

  public async subscribe({ response, request }: HttpContext): Promise<void> {
    const { subject } = request.only(['subject'])

    try {
      // await NatsService.subscribe(subject)
      response.send('Connexion drainée avec succès + Subscribe publication.')
    } catch (error) {
      response.send('Erreur lors de la connexion à NATS: ' + error)
    }
  }
}
