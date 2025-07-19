import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import MaintenanceWebSite from '#models/maintenance_web_site'
import logger from '@adonisjs/core/services/logger'
import { errors as lucidErrors } from '@adonisjs/lucid'

/**
 * Un service pour gérer le site web de maintenance.
 * Ce service fournit des méthodes pour vérifier si le site est en maintenance
 * et pour mettre à jour l'état de maintenance du site.
 * @class MaintenanceWebSiteService
 */
export default class MaintenanceWebSiteService {
  /**
   * Vérifie si le site est en mode maintenance.
   * @returns {Promise<boolean>} - Retourne true si le site est en maintenance, sinon false.
   * @throws {NotFoundException} Si le site de maintenance n'est pas trouvé.
   */
  public static async isMaintenance(): Promise<boolean> {
    try {
      // Récupère le premier enregistrement de MaintenanceWebSite
      const maintenanceWebSite: MaintenanceWebSite = await MaintenanceWebSite.firstOrFail()

      // Vérifie si le site est en maintenance
      if (maintenanceWebSite.is_maintenance) {
        return true
      } else {
        return false
      }
    } catch (error: any) {
      logger.error('isMaintenance error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`MaintenanceWebSite not found`)
      }

      throw new InternalServerErrorException('Failed to check maintenance status')
    }
  }

  /**
   * Met à jour l'état de maintenance du site.
   * @param {boolean} updatedIsMaintenance - L'état de maintenance mis à jour.
   * @returns {Promise<MaintenanceWebSite>} - Le site de maintenance mis à jour.
   * @throws {BadRequestException} Si la mise à jour échoue.
   */
  public static async updateIsMaintenance(updatedIsMaintenance: boolean): Promise<MaintenanceWebSite> {
    // Récupère le premier enregistrement de MaintenanceWebSite
    const maintenanceWebSite: MaintenanceWebSite = await MaintenanceWebSite.firstOrFail()

    try {
      // Met à jour l'état de maintenance et renvoie l'enregistrement mis à jour
      return await maintenanceWebSite
        .merge({
          is_maintenance: updatedIsMaintenance,
        })
        .save()
    } catch (error: any) {
      logger.error('updateIsMaintenance error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`MaintenanceWebSite not found`)
      }

      throw new InternalServerErrorException('Failed to update maintenance status')
    }
  }
}
