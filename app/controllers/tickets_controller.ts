import TicketsService from '#services/tickets_service'
import type { HttpContext } from '@adonisjs/core/http'
import type Ticket from '#models/ticket'
import { updateTicketByIdForStatusValidator } from '#validators/Ticket/update_ticket_by_id_for_status_validator'
import { createTicketsValidator } from '#validators/Ticket/CreateTicketsValidator'
import BadRequestException from '#exceptions/bad_request_exception'

/**
 *
 */
export default class TicketsController {
  /**
   *
   */
  public async createTickets({ request, response }: HttpContext): Promise<void> {
    // Récupération des données de la requête
    const payload: {
      subject: string
      description: string
      statusId: number
      categoryId: number
      userId: number
    } = await request.validateUsing(createTicketsValidator)

    // Création du ticket en utilisant le service TicketsService
    const ticket: Ticket = await TicketsService.createTickets(
      payload.subject,
      payload.description,
      payload.statusId,
      payload.categoryId,
      payload.userId,
    )

    // Response 201 Document created
    response.status(201).json(ticket)
  }

  /**
   *
   */
  public async getTicketsById({ params, response }: HttpContext): Promise<void> {
    const id: number = Number(params.id)
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid ticket id')
    }

    const ticket: Ticket = await TicketsService.getTicketsById(id)
    response.status(200).json(ticket)
  }

  /**
   *
   */
  public async getAllTicketsByUserId({ request, response, params }: HttpContext): Promise<void> {
    const start: number = request.input('start')
    const end: number = request.input('end')
    const userId: number = Number(params.userId)
    if (Number.isNaN(userId)) {
      throw new BadRequestException('Invalid user id')
    }

    const tickets: Ticket[] = await TicketsService.getAllTicketsByUserId(userId, start, end)
    response.status(200).json(tickets)
  }

  /**
   *
   */
  public async getAllTickets({ response, request }: HttpContext): Promise<void> {
    const start: number = request.input('start')
    const end: number = request.input('end')
    const tickets: Ticket[] = await TicketsService.getAllTickets(start, end)
    response.status(200).json(tickets)
  }

  /**
   *
   */
  public async updateTicketByIdForStatus({ request, response, params }: HttpContext): Promise<void> {
    const payload: {
      name: string
    } = await request.validateUsing(updateTicketByIdForStatusValidator)
    const ticket: Ticket = await TicketsService.updateTicketByIdForStatus(params.id, payload.name)
    response.status(200).json(ticket)
  }

  /**
   *
   */
  public async getTicketsCountByStatusOpenForUser({ params, response }: HttpContext): Promise<void> {
    const countTicketsOpen: number = await TicketsService.getTicketsCountByStatusOpenForUser(params.userId)
    response.status(200).json(countTicketsOpen)
  }
}
