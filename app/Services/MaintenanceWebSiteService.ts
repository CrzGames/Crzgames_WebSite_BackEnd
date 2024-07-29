import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import MaintenanceWebSite from 'App/Models/MaintenanceWebSite'

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

  public static async updateIsMaintenance(
    updatedIsMaintenance: boolean,
  ): Promise<MaintenanceWebSite> {
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
