import type { HttpContext } from '@adonisjs/core/http'
import type TicketCategory from '#models/ticket_category'
import TicketCategoriesService from '#services/ticket_categories_service'

/**
 *
 */
export default class TicketCategoriesController {
  //functions to get all ticket categories
  /**
   *
   */
  public async getAllTicketCategories({ response }: HttpContext): Promise<void> {
    const ticketCategories: TicketCategory[] = await TicketCategoriesService.getAllTicketCategories()

    response.status(200).json(ticketCategories)
  }
}
