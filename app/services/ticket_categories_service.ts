import TicketCategory from '#models/ticket_category'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import logger from '@adonisjs/core/services/logger'

/**
 * Service pour gérer les catégories de tickets
 * Fournit des méthodes pour récupérer toutes les catégories de tickets
 * @class TicketCategoriesService
 */
export default class TicketCategoriesService {
  /**
   * Fonction pour récupérer toutes les catégories de tickets
   * @returns {Promise<TicketCategory>} - La catégorie de ticket correspondante
   */
  public static async getAllTicketCategories(): Promise<TicketCategory[]> {
    try {
      // Récupérer toutes les catégories de tickets
      const ticketCategories: TicketCategory[] = await TicketCategory.all()

      // Vérifier si des catégories de tickets ont été trouvées
      if (ticketCategories.length === 0) {
        throw new NotFoundException('No ticket categories found')
      }

      return ticketCategories
    } catch (error: any) {
      logger.error('getAllTicketCategories error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch ticket categories')
    }
  }
}
