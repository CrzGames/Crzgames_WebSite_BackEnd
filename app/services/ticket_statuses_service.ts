import TicketStatus from '#models/ticket_status'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import logger from '@adonisjs/core/services/logger'
import { errors as lucidErrors } from '@adonisjs/lucid'

/**
 * Service pour gérer les statuts de tickets
 * Fournit des méthodes pour récupérer tous les statuts de tickets et obtenir l'ID d'un statut par son nom
 * @class TicketStatusesService
 */
export default class TicketStatusesService {
  /**
   * Fonction pour récupérer tous les statuts de tickets
   * @returns {Promise<TicketStatus[]>} - Un tableau de tous les statuts de tickets
   */
  public static async getAllTicketStatuses(): Promise<TicketStatus[]> {
    try {
      // Récupérer tous les statuts de tickets
      const ticketStatuses: TicketStatus[] = await TicketStatus.all()

      // Vérifier si des statuts de tickets ont été trouvés
      if (ticketStatuses.length === 0) {
        throw new NotFoundException('No ticket statuses found')
      }

      return ticketStatuses
    } catch (error: any) {
      logger.error('getAllTicketStatuses error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch ticket statuses')
    }
  }

  /**
   * Fonction pour obtenir l'ID d'un statut de ticket par son nom
   * @param {string} name - Le nom du statut de ticket
   * @returns {Promise<number>} - L'ID du statut de ticket correspondant
   * @throws {NotFoundException} Si le statut de ticket n'est pas trouvé
   */
  public static async getTicketStatusIdByName(name: string): Promise<number> {
    try {
      const ticketStatus: TicketStatus = await TicketStatus.query().where('name', name).firstOrFail()
      return ticketStatus.id
    } catch (error: any) {
      logger.error('getTicketStatusIdByName error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Ticket status with name ${name} not found`)
      }

      throw new InternalServerErrorException(`Failed to fetch ticket status by name: ${name}`)
    }
  }
}
