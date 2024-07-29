import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateTicketResponsesValidator from 'App/Validators/TicketResponse/CreateTicketResponsesValidator'
import TicketResponsesService from 'App/Services/TicketResponsesService'
import TicketResponse from 'App/Models/TicketResponse'
import GetAllTicketsResponsesByTicketIdValidator from 'App/Validators/TicketResponse/GetAllTicketsResponsesByTicketIdValidator'

export default class TicketResponsesController {
  private async createTicketResponses({ request, response }: HttpContextContract): Promise<void> {
    // Récupération des données de la requête
    const payload: { content: string; userId: number; ticketId: number } = await request.validate(
      CreateTicketResponsesValidator,
    )

    // Création du ticket en utilisant le service TicketsResponseService
    await TicketResponsesService.createTicketResponses(
      payload.content,
      payload.userId,
      payload.ticketId,
    )

    // Response 201 Document created
    response.status(201)
  }

  private async getAllTicketsResponsesByTicketId({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: { ticketId: number } = await request.validate(
      GetAllTicketsResponsesByTicketIdValidator,
    )

    const ticketsResponse: TicketResponse[] =
      await TicketResponsesService.getAllTicketsResponsesByTicketId(payload.ticketId)

    response.status(200).json(ticketsResponse)
  }
}
