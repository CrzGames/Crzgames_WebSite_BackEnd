import Ticket from '#models/ticket'
import TicketResponsesService from '#services/ticket_responses_service'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import TicketStatusesService from '#services/ticket_statuses_service'
import { TicketStatus } from '#enums/ticket_status'
import { errors as lucidErrors } from '@adonisjs/lucid'
import logger from '@adonisjs/core/services/logger'

/**
 * Un service pour gérer les tickets.
 * Ce service fournit des méthodes pour créer, mettre à jour et récupérer des tickets.
 * @class TicketsService
 */
export default class TicketsService {
  /**
   * Met à jour le statut d'un ticket par son ID.
   * @param {number} id - L'ID du ticket à mettre à jour.
   * @param {string} name - Le nom du nouveau statut du ticket.
   * @returns {Promise<Ticket>} - Le ticket mis à jour.
   */
  public static async updateTicketByIdForStatus(id: number, name: string): Promise<Ticket> {
    try {
      const ticket: Ticket = await Ticket.findOrFail(id)
      ticket.ticket_statuses_id = await TicketStatusesService.getTicketStatusIdByName(name)
      return await ticket.save()
    } catch (error: any) {
      logger.error('updateTicketByIdForStatus error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Ticket with ID ${id} not found`)
      }

      throw new InternalServerErrorException(`Failed to update ticket status: ${error.message}`)
    }
  }

  /**
   * Crée un ticket avec les informations fournies.
   * @param {string} subject - Le sujet du ticket.
   * @param {string} description - La description du ticket.
   * @param {number} ticket_statuses_id - L'ID du statut du ticket.
   * @param {number} ticket_categories_id - L'ID de la catégorie du ticket.
   * @param {number} users_id - L'ID de l'utilisateur qui a créé le ticket.
   * @returns {Promise<Ticket>} - Le ticket créé.
   */
  public static async createTickets(
    subject: string,
    description: string,
    ticket_statuses_id: number,
    ticket_categories_id: number,
    users_id: number,
  ): Promise<Ticket> {
    try {
      const ticket: Ticket = await Ticket.create({
        subject,
        ticket_statuses_id,
        ticket_categories_id,
        users_id,
      })

      await TicketResponsesService.createTicketResponses(description, users_id, ticket.id)

      return ticket
    } catch (error: any) {
      logger.error('createTickets error: ' + error.message)

      throw new InternalServerErrorException('Failed to create ticket')
    }
  }

  /**
   * Récupère un ticket par son ID.
   * @param {number} id - L'ID du ticket à mettre à jour.
   * @returns {Promise<Ticket>} - Le ticket mis à jour.
   */
  public static async getTicketsById(id: number): Promise<Ticket> {
    try {
      return await Ticket.query().preload('user').where('id', id).firstOrFail()
    } catch (error: any) {
      logger.error('getTicketsById error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Ticket with ID ${id} not found`)
      }

      throw new InternalServerErrorException(`Failed to fetch ticket by ID: ${id}`)
    }
  }

  /**
   * Récupère tous les tickets, avec la possibilité de paginer les résultats.
   * @param {number} [start] - L'index de début pour la pagination.
   * @param {number} [end] - L'index de fin pour la pagination.
   * @returns {Promise<Ticket[]>} - Un tableau de tickets.
   */
  public static async getAllTickets(start?: number, end?: number): Promise<Ticket[]> {
    try {
      const tickets: Ticket[] = await Ticket.query()
        .preload('user')
        .orderBy('created_at', 'desc')
        .preload('ticketStatus')
        .preload('ticketCategory')
        .exec()

      if (tickets.length === 0) {
        throw new NotFoundException('No ticket found')
      }

      if (start && end) {
        return tickets.slice(start, end)
      } else {
        return tickets
      }
    } catch (error) {
      logger.error('getAllTickets error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch all tickets')
    }
  }

  /**
   * Récupère tous les tickets d'un utilisateur par son ID, avec la possibilité de paginer les résultats.
   * @param {number} userId - L'ID de l'utilisateur pour lequel récupérer les tickets.
   * @param {number} [start] - L'index de début pour la pagination.
   * @param {number} [end] - L'index de fin pour la pagination.
   * @returns {Promise<Ticket[]>} - Un tableau de tickets associés à l'utilisateur.
   */
  public static async getAllTicketsByUserId(userId: number, start?: number, end?: number): Promise<Ticket[]> {
    try {
      const tickets: Ticket[] = await Ticket.query()
        .preload('user')
        .preload('ticketStatus')
        .preload('ticketCategory')
        .where('users_id', userId)
        .orderBy('created_at', 'desc')
        .exec()

      if (tickets.length === 0) {
        throw new NotFoundException('No ticket found')
      }

      if (start && end) {
        return tickets.slice(start, end)
      } else {
        return tickets
      }
    } catch (error: any) {
      logger.error('getAllTicketsByUserId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch tickets for user')
    }
  }

  /**
   * Récupère l'ID de l'utilisateur associé à un ticket par son ID.
   * @param {number} ticketId - L'ID du ticket pour lequel récupérer l'ID de l'utilisateur.
   * @returns {Promise<number>} - L'ID de l'utilisateur associé au ticket.
   * @throws {NotFoundException} Si le ticket n'est pas trouvé.
   */
  public static async getUserIdByTicketId(ticketId: number): Promise<number> {
    try {
      const ticket: Ticket = await Ticket.query().where('id', ticketId).firstOrFail()
      return ticket.users_id
    } catch (error: any) {
      logger.error('getUserIdByTicketId error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Ticket with ID ${ticketId} not found`)
      }

      throw new InternalServerErrorException(`Failed to fetch user ID by ticket ID: ${ticketId}`)
    }
  }

  /**
   * Récupère le nombre de tickets ouverts pour un utilisateur spécifique.
   * @param {number} userId - L'ID de l'utilisateur pour lequel récupérer le nombre de tickets ouverts.
   * @returns {Promise<number>} - Le nombre de tickets ouverts pour l'utilisateur.
   * @throws {NotFoundException} Si aucun ticket n'est trouvé pour l'utilisateur.
   */
  public static async getTicketsCountByStatusOpenForUser(userId: number): Promise<number> {
    try {
      const tickets: Ticket[] = await this.getAllTicketsByUserId(userId)
      return tickets.filter((ticket: Ticket): boolean => ticket.ticketStatus.name === TicketStatus.OPEN).length
    } catch (error: any) {
      logger.error('getTicketsCountByStatusOpenForUser error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch tickets count for user')
    }
  }
}
