import TicketsService from '#services/tickets_service'
import { HttpContext } from '@adonisjs/core/http'
import CreateTicketsValidator from '#validators/ticket/create_tickets_validator'
import Ticket from '#models/ticket'
import GetTicketsByIdValidator from '#validators/ticket/get_tickets_by_id_validator'
import GetAllTicketsByUserIdValidator from '#validators/ticket/get_all_tickets_by_user_id_validator'
import UpdateTicketByIdForStatusValidator from '#validators/ticket/update_ticket_by_id_for_status_validator'

export default class TicketsController {
  public async createTickets({ request, response }: HttpContext): Promise<void> {
    // Récupération des données de la requête
    const payload: {
      subject: string
      description: string
      statusId: number
      categoryId: number
      userId: number
    } = await request.validate(CreateTicketsValidator)

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

  public async getTicketsById({ request, response }: HttpContext): Promise<void> {
    const payload: { id: number } = await request.validate(GetTicketsByIdValidator)
    const ticket: Ticket = await TicketsService.getTicketsById(payload.id)
    response.status(200).json(ticket)
  }

  public async getAllTicketsByUserId({ request, response }: HttpContext): Promise<void> {
    const start: number = request.input('start')
    const end: number = request.input('end')
    const payload: { userId: number } = await request.validate(GetAllTicketsByUserIdValidator)
    const tickets: Ticket[] = await TicketsService.getAllTicketsByUserId(payload.userId, start, end)
    response.status(200).json(tickets)
  }

  public async getAllTickets({ response, request }: HttpContext): Promise<void> {
    const start: number = request.input('start')
    const end: number = request.input('end')
    const tickets: Ticket[] = await TicketsService.getAllTickets(start, end)
    response.status(200).json(tickets)
  }

  public async updateTicketByIdForStatus({ request, response, params }: HttpContext): Promise<void> {
    const payload: {
      name: string
    } = await request.validate(UpdateTicketByIdForStatusValidator)
    const ticket: Ticket = await TicketsService.updateTicketByIdForStatus(params.id, payload.name)
    response.status(200).json(ticket)
  }

  public async getTicketsCountByStatusOpenForUser({ params, response }: HttpContext): Promise<void> {
    const countTicketsOpen: number = await TicketsService.getTicketsCountByStatusOpenForUser(params.userId)
    response.status(200).json(countTicketsOpen)
  }
}
