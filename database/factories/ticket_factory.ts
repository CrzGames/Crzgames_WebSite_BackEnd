import factory from '@adonisjs/lucid/factories'
import Ticket from '#models/ticket'
import User from '#models/user'
import TicketStatus from '#models/ticket_status'
import TicketCategory from '#models/ticket_category'

export const TicketFactory = factory
  .define(Ticket, async ({ faker }) => {
    const userIds: number[] = (await User.all()).map((user: User) => user.id)
    const categoryIds: number[] = (await TicketCategory.all()).map((category: TicketCategory) => category.id)
    const statusIds: number[] = (await TicketStatus.all()).map((status: TicketStatus) => status.id)

    return {
      subject: faker.lorem.sentence(),
      ticket_statuses_id: faker.helpers.arrayElement(statusIds),
      users_id: faker.helpers.arrayElement(userIds),
      ticket_categories_id: faker.helpers.arrayElement(categoryIds),
    }
  })
  .build()
