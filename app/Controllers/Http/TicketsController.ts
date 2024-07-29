import TicketsService from 'App/Services/TicketsService'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateTicketsValidator from 'App/Validators/Ticket/CreateTicketsValidator'
import Ticket from 'App/Models/Ticket'
import GetTicketsByIdValidator from 'App/Validators/Ticket/GetTicketsByIdValidator'
import GetAllTicketsByUserIdValidator from 'App/Validators/Ticket/GetAllTicketsByUserIdValidator'
import UpdateTicketByIdForStatusValidator from 'App/Validators/Ticket/UpdateTicketByIdForStatusValidator'

export default class TicketsController {
  private async createTickets({ request, response }: HttpContextContract): Promise<void> {
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

  private async getTicketsById({ request, response }: HttpContextContract): Promise<void> {
    const payload: { id: number } = await request.validate(GetTicketsByIdValidator)
    const ticket: Ticket = await TicketsService.getTicketsById(payload.id)
    response.status(200).json(ticket)
  }

  private async getAllTicketsByUserId({ request, response }: HttpContextContract): Promise<void> {
    const start: number = request.input('start')
    const end: number = request.input('end')
    const payload: { userId: number } = await request.validate(GetAllTicketsByUserIdValidator)
    const tickets: Ticket[] = await TicketsService.getAllTicketsByUserId(payload.userId, start, end)
    response.status(200).json(tickets)
  }

  private async getAllTickets({ response, request }: HttpContextContract): Promise<void> {
    const start: number = request.input('start')
    const end: number = request.input('end')
    const tickets: Ticket[] = await TicketsService.getAllTickets(start, end)
    response.status(200).json(tickets)
  }

  private async updateTicketByIdForStatus({
    request,
    response,
    params,
  }: HttpContextContract): Promise<void> {
    const payload: {
      name: string
    } = await request.validate(UpdateTicketByIdForStatusValidator)
    const ticket: Ticket = await TicketsService.updateTicketByIdForStatus(params.id, payload.name)
    response.status(200).json(ticket)
  }

  private async getTicketsCountByStatusOpenForUser({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const countTicketsOpen: number = await TicketsService.getTicketsCountByStatusOpenForUser(
      params.userId,
    )
    response.status(200).json(countTicketsOpen)
  }
}
