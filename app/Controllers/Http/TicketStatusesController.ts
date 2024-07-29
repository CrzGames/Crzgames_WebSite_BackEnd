import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TicketStatus from 'App/Models/TicketStatus'
import TicketStatusesService from 'App/Services/TicketStatusesService'

export default class TicketStatusesController {
  //functions to get all ticket statuses
  private async getAllTicketStatuses({ response }: HttpContextContract): Promise<void> {
    const ticketStatuses: TicketStatus[] = await TicketStatusesService.getAllTicketStatuses()
    response.status(200).json(ticketStatuses)
  }
}
