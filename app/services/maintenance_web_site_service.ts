import { BadRequestException } from '#exceptions/bad_request_exception'
import { NotFoundException } from '#exceptions/not_found_exception'
import MaintenanceWebSite from '#models/maintenance_web_site'

export default class MaintenanceWebSiteService {
  public static async isMaintenance(): Promise<boolean> {
    try {
      const maintenanceWebSite: MaintenanceWebSite = await MaintenanceWebSite.firstOrFail()
      if (maintenanceWebSite.is_maintenance) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new NotFoundException(`Failed to find maintenance web site: ${error.message}`)
    }
  }

  public static async updateIsMaintenance(updatedIsMaintenance: boolean): Promise<MaintenanceWebSite> {
    const maintenanceWebSite: MaintenanceWebSite = await MaintenanceWebSite.firstOrFail()

    try {
      maintenanceWebSite.merge({
        is_maintenance: updatedIsMaintenance,
      })
      await maintenanceWebSite.save()
      return maintenanceWebSite
    } catch (error) {
      throw new BadRequestException(`Failed to update game version: ${error.message}`)
    }
  }
}
