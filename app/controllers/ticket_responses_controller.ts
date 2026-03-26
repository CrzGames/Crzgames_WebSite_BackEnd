import type { HttpContext } from '@adonisjs/core/http'
import { createTicketResponsesValidator } from '#validators/TicketResponse/CreateTicketResponsesValidator'
import TicketResponsesService from '#services/ticket_responses_service'
import type TicketResponse from '#models/ticket_response'
import BadRequestException from '#exceptions/bad_request_exception'

/**
 *
 */
export default class TicketResponsesController {
  /**
   *
   */
  public async createTicketResponses({ request, response }: HttpContext): Promise<void> {
    // Récupération des données de la requête
    const payload: { content: string; userId: number; ticketId: number } =
      await request.validateUsing(createTicketResponsesValidator)

    // Création du ticket en utilisant le service TicketsResponseService
    await TicketResponsesService.createTicketResponses(payload.content, payload.userId, payload.ticketId)

    // Response 201 Document created
    response.status(201)
  }

  /**
   *
   */
  public async getAllTicketsResponsesByTicketId({ params, response }: HttpContext): Promise<void> {
    const ticketId: number = Number(params.ticketId)
    if (Number.isNaN(ticketId)) {
      throw new BadRequestException('Invalid ticket id')
    }

    const ticketsResponse: TicketResponse[] = await TicketResponsesService.getAllTicketsResponsesByTicketId(ticketId)

    response.status(200).json(ticketsResponse)
  }
}
