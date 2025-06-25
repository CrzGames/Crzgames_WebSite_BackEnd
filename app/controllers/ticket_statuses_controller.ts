import type { HttpContext } from '@adonisjs/core/http'
import TicketStatus from '#models/ticket_status'
import TicketStatusesService from '#services/ticket_statuses_service'

export default class TicketStatusesController {
  //functions to get all ticket statuses
  public async getAllTicketStatuses({ response }: HttpContext): Promise<void> {
    const ticketStatuses: TicketStatus[] = await TicketStatusesService.getAllTicketStatuses()
    response.status(200).json(ticketStatuses)
  }
}
