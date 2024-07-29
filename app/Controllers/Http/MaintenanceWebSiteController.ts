import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MaintenanceWebSiteService from 'App/Services/MaintenanceWebSiteService'

export default class MaintenanceWebSiteController {
  private async updateIsMaintenance({ response, request }: HttpContextContract): Promise<void> {
    const payload: { is_maintenance: boolean } = request.only(['is_maintenance'])
    await MaintenanceWebSiteService.updateIsMaintenance(payload.is_maintenance)
    response.status(200).send('Maintenance web site updated successfully.')
  }

  private async isMaintenance({ response }: HttpContextContract): Promise<void> {
    const isMaintenance: boolean = await MaintenanceWebSiteService.isMaintenance()
    response.status(200).send({ is_maintenance: isMaintenance })
  }
}
