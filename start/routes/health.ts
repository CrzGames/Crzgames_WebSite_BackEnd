import Route from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

/*
  Documentation : https://docs.adonisjs.com/guides/health-check

  Une pratique courante consiste à exposer un point de terminaison HTTP que les systèmes de déploiement peuvent envoyer
  par ping pour vérifier l'intégrité de votre application.
*/
Route.get('health', async ({ response }: HttpContextContract): Promise<void> => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})
