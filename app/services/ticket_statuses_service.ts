import TicketStatus from '#models/ticket_status'
import { NotFoundException } from '#exceptions/not_found_exception'
import { InternalServerErrorException } from '#exceptions/internal_server_error_exception'

export default class TicketStatusesService {
  //functions to get all ticket statuses
  public static async getAllTicketStatuses(): Promise<TicketStatus[]> {
    try {
      const ticketStatuses: TicketStatus[] = await TicketStatus.all()

      if (!ticketStatuses || ticketStatuses.length === 0) {
        throw new NotFoundException('No ticketStatuses found')
      }

      return ticketStatuses
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  public static async getTicketStatusIdByName(name: string): Promise<number> {
    try {
      const ticketStatus: TicketStatus = await TicketStatus.query().where('name', name).firstOrFail()
      return ticketStatus.id
    } catch (error) {
      throw new NotFoundException('TicketStatus not found')
    }
  }
}
