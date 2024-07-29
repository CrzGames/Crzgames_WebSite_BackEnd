import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NatsService from 'App/Services/NatsService'

export default class NatsController {
  private async publish({ response, request }: HttpContextContract): Promise<void> {
    const data = request.only(['message', 'subject'])

    try {
      //await NatsService.publish(data.subject, data.message)
      response.send('Connexion drainée avec succès + Publish subject and message.')
    } catch (error) {
      response.send('Erreur lors de la connexion à NATS: ' + error)
    }
  }

  private static async subscribe({ response, request }: HttpContextContract): Promise<void> {
    const { subject } = request.only(['subject'])

    try {
      // await NatsService.subscribe(subject)
      response.send('Connexion drainée avec succès + Subscribe publication.')
    } catch (error) {
      response.send('Erreur lors de la connexion à NATS: ' + error)
    }
  }
}
