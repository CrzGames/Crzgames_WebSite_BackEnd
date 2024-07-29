import TicketResponse from 'App/Models/TicketResponse'
import MailService from 'App/Services/MailService'
import UsersService from 'App/Services/UsersService'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import TicketsService from 'App/Services/TicketsService'

export default class TicketResponsesService {
  // Fonction pour créer un nouveau ticket
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
              Env.get('APP_BASE_URL') + Env.get('APP_REDIRECT_URI_TICKET_RESPONSE') + tickets_id,
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
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Fonction pour récupérer tous les ticketsResponse pour un ticketId
  public static async getAllTicketsResponsesByTicketId(
    ticketId: number,
  ): Promise<TicketResponse[]> {
    try {
      const ticketResponses: TicketResponse[] = await TicketResponse.query()
        .where('tickets_id', ticketId)
        .preload('user')

      if (!ticketResponses || ticketResponses.length === 0) {
        throw new NotFoundException('No ticket response found by ticket id')
      }

      return ticketResponses
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
