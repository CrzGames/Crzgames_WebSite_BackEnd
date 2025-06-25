import TicketResponse from '#models/ticket_response'
import MailService from '#services/mail_service'
import UsersService from '#services/users_service'
import User from '#models/user'
import env from '#start/env'
import { BadRequestException } from '#exceptions/bad_request_exception'
import { NotFoundException } from '#exceptions/not_found_exception'
import { InternalServerErrorException } from '#exceptions/internal_server_error_exception'
import TicketsService from '#services/tickets_service'

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
            ticketURL: env.get('APP_BASE_URL') + env.get('APP_REDIRECT_URI_TICKET_RESPONSE') + tickets_id,
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
  public static async getAllTicketsResponsesByTicketId(ticketId: number): Promise<TicketResponse[]> {
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
