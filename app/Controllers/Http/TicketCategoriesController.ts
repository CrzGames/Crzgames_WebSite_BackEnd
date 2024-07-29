import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TicketCategory from 'App/Models/TicketCategory'
import TicketCategoriesService from 'App/Services/TicketCategoriesService'

export default class TicketCategoriesController {
  //functions to get all ticket categories
  private async getAllTicketCategories({ response }: HttpContextContract): Promise<void> {
    const ticketCategories: TicketCategory[] =
      await TicketCategoriesService.getAllTicketCategories()

    response.status(200).json(ticketCategories)
  }
}
