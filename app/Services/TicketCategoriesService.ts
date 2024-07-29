import TicketCategory from 'App/Models/TicketCategory'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'

export default class TicketCategoriesService {
  //functions to get all ticket categories
  public static async getAllTicketCategories(): Promise<TicketCategory[]> {
    try {
      const ticketCategories: TicketCategory[] = await TicketCategory.all()

      if (!ticketCategories || ticketCategories.length === 0) {
        throw new NotFoundException('No ticket categories found')
      }

      return ticketCategories
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
