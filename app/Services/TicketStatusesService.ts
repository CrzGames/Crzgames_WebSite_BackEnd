import TicketStatus from 'App/Models/TicketStatus'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'

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
      const ticketStatus: TicketStatus = await TicketStatus.query()
        .where('name', name)
        .firstOrFail()
      return ticketStatus.id
    } catch (error) {
      throw new NotFoundException('TicketStatus not found')
    }
  }
}
