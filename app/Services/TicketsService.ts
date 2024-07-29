import Ticket from 'App/Models/Ticket'
import TicketResponsesService from 'App/Services/TicketResponsesService'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import TicketStatusesService from 'App/Services/TicketStatusesService'
import { TicketStatus } from 'App/Enums/TicketStatus'

export default class TicketsService {
  public static async updateTicketByIdForStatus(id: number, name: string): Promise<Ticket> {
    const ticket: Ticket = await Ticket.findOrFail(id)

    try {
      ticket.ticket_statuses_id = await TicketStatusesService.getTicketStatusIdByName(name)
      await ticket.save()

      return ticket
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // Fonction pour créer un nouveau ticket
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
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Fonction pour récupérer un ticket par son id
  public static async getTicketsById(id: number): Promise<Ticket> {
    try {
      return await Ticket.query().preload('user').where('id', id).firstOrFail()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // Fonction pour récupérer tous les tickets
  public static async getAllTickets(start?: number, end?: number): Promise<Ticket[]> {
    try {
      const tickets: Ticket[] = await Ticket.query()
        .preload('user')
        .orderBy('created_at', 'desc')
        .preload('ticketStatus')
        .preload('ticketCategory')
        .exec()

      if (!tickets || tickets.length === 0) {
        throw new NotFoundException('No ticket found')
      }

      if (start && end) {
        return tickets.slice(start, end)
      } else {
        return tickets
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  // Fonction pour récupérer tous les tickets pour un userId
  public static async getAllTicketsByUserId(
    userId: number,
    start?: number,
    end?: number,
  ): Promise<Ticket[]> {
    try {
      const tickets: Ticket[] = await Ticket.query()
        .preload('user')
        .preload('ticketStatus')
        .preload('ticketCategory')
        .where('users_id', userId)
        .orderBy('created_at', 'desc')
        .exec()

      if (!tickets || tickets.length === 0) {
        throw new NotFoundException('No ticket found')
      }

      if (start && end) {
        return tickets.slice(start, end)
      } else {
        return tickets
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  public static async getUserIdByTicketId(ticketId: number): Promise<number> {
    try {
      const ticket: Ticket = await Ticket.query().where('id', ticketId).firstOrFail()
      return ticket.users_id
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  // Récupérer tout les tickets du user, puis calculer le nombre de ticket en status 'Open', pour indiquer côté front-end le nombre de message du support en attente
  public static async getTicketsCountByStatusOpenForUser(userId: number): Promise<number> {
    try {
      const tickets: Ticket[] = await this.getAllTicketsByUserId(userId)
      return tickets.filter(
        (ticket: Ticket): boolean => ticket.ticketStatus.name === TicketStatus.OPEN,
      ).length
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }
}
