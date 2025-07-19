import TicketResponse from '#models/ticket_response'
import MailService from '#services/mail_service'
import UsersService from '#services/users_service'
import type User from '#models/user'
import env from '#start/env'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import TicketsService from '#services/tickets_service'
import logger from '@adonisjs/core/services/logger'

/**
 * Un service pour gérer les réponses aux tickets.
 * Ce service fournit des méthodes pour créer une réponse à un ticket et pour récupérer
 * toutes les réponses d'un ticket spécifique.
 * @class TicketResponsesService
 */
export default class TicketResponsesService {
  /**
   * Crée une réponse à un ticket.
   * @param {string} content - Le contenu de la réponse au ticket.
   * @param {number} users_id - L'ID de l'utilisateur qui répond au ticket.
   * @param {number} tickets_id - L'ID du ticket auquel la réponse est associée.
   * @returns {Promise<TicketResponse>} - La réponse au ticket créée.
   */
  public static async createTicketResponses(
    content: string,
    users_id: number,
    tickets_id: number,
  ): Promise<TicketResponse> {
    try {
      const isSupport: boolean = await UsersService.isSupport(users_id)

      // Si l'utilisateur qui as répondu est du support, on envoie un mail à l'utilisateur
      if (isSupport) {
        const userId: number = await TicketsService.getUserIdByTicketId(tickets_id)
        const user: User = await UsersService.getUsersById(userId)

        await MailService.sendMail(
          user.email,
          'ticket-response',
          {
            username: user.username,
            ticketURL:
              env.get('FRONTEND_APP_BASE_URL') + env.get('FRONTEND_APP_REDIRECT_URI_TICKET_RESPONSE') + tickets_id,
            ticketNumber: tickets_id,
            contentResponseSupport: content,
          },
          `Ticket #${tickets_id} Response - CrzGames`,
        )
      }

      return await TicketResponse.create({
        content,
        users_id,
        tickets_id,
        is_support: isSupport,
      })
    } catch (error: any) {
      logger.error('createTicketResponses error: ' + error.message)

      throw new InternalServerErrorException('Failed to create ticket response')
    }
  }

  /**
   * Récupère toutes les réponses d'un ticket spécifique par son ID.
   * @param {number} ticketId - L'ID du ticket pour lequel récupérer les réponses.
   * @returns {Promise<TicketResponse[]>} - Une promesse qui résout avec un tableau de réponses au ticket.
   * @throws {NotFoundException} Si aucune réponse n'est trouvée pour le ticket spécifié.
   * @throws {InternalServerErrorException} En cas d'erreur lors de la récupération des réponses.
   */
  public static async getAllTicketsResponsesByTicketId(ticketId: number): Promise<TicketResponse[]> {
    try {
      const ticketResponses: TicketResponse[] = await TicketResponse.query()
        .where('tickets_id', ticketId)
        .preload('user')

      if (ticketResponses.length === 0) {
        throw new NotFoundException('No ticket response found by ticket id')
      }

      return ticketResponses
    } catch (error: any) {
      logger.error('getAllTicketsResponsesByTicketId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch ticket responses by ticket id')
    }
  }
}
