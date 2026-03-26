import type { HttpContext } from '@adonisjs/core/http'
import MaintenanceWebSiteService from '#services/maintenance_web_site_service'

/**
 *
 */
export default class MaintenanceWebSiteController {
  /**
   *
   */
  public async updateIsMaintenance({ response, request }: HttpContext): Promise<void> {
    const payload: { is_maintenance: boolean } = request.only(['is_maintenance'])
    await MaintenanceWebSiteService.updateIsMaintenance(payload.is_maintenance)
    response.status(200).send('Maintenance web site updated successfully.')
  }

  /**
   *
   */
  public async isMaintenance({ response }: HttpContext): Promise<void> {
    const isMaintenance: boolean = await MaintenanceWebSiteService.isMaintenance()
    response.status(200).send({ is_maintenance: isMaintenance })
  }
}
