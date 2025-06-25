import { HttpContext } from '@adonisjs/core/http'
import CreateTicketResponsesValidator from '#validators/ticket_response/create_ticket_responses_validator'
import TicketResponsesService from '#services/ticket_responses_service'
import TicketResponse from '#models/ticket_response'
import GetAllTicketsResponsesByTicketIdValidator from '#validators/ticket_response/get_all_tickets_responses_by_ticket_id_validator'

export default class TicketResponsesController {
  public async createTicketResponses({ request, response }: HttpContext): Promise<void> {
    // Récupération des données de la requête
    const payload: { content: string; userId: number; ticketId: number } =
      await request.validate(CreateTicketResponsesValidator)

    // Création du ticket en utilisant le service TicketsResponseService
    await TicketResponsesService.createTicketResponses(payload.content, payload.userId, payload.ticketId)

    // Response 201 Document created
    response.status(201)
  }

  public async getAllTicketsResponsesByTicketId({ request, response }: HttpContext): Promise<void> {
    const payload: { ticketId: number } = await request.validate(GetAllTicketsResponsesByTicketIdValidator)

    const ticketsResponse: TicketResponse[] = await TicketResponsesService.getAllTicketsResponsesByTicketId(
      payload.ticketId,
    )

    response.status(200).json(ticketsResponse)
  }
}
