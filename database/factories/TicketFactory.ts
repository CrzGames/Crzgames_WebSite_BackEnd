import Factory from '@ioc:Adonis/Lucid/Factory'
import Ticket from 'App/Models/Ticket'
import User from 'App/Models/User'
import TicketStatus from 'App/Models/TicketStatus'
import TicketCategory from 'App/Models/TicketCategory'

export const TicketFactory = Factory.define(Ticket, async ({ faker }) => {
  const userIds: number[] = (await User.all()).map((user: User) => user.id)
  const categoryIds: number[] = (await TicketCategory.all()).map(
    (category: TicketCategory) => category.id,
  )
  const statusIds: number[] = (await TicketStatus.all()).map((status: TicketStatus) => status.id)

  return {
    subject: faker.lorem.sentence(),
    ticket_statuses_id: faker.helpers.arrayElement(statusIds),
    users_id: faker.helpers.arrayElement(userIds),
    ticket_categories_id: faker.helpers.arrayElement(categoryIds),
  }
}).build()
