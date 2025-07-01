import TicketCategory from '#models/ticket_category'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'

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
