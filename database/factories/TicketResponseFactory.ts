import Factory from '@ioc:Adonis/Lucid/Factory'
import TicketResponse from 'App/Models/TicketResponse'
import User from 'App/Models/User'
import Ticket from 'App/Models/Ticket'
import { UserRoles } from 'App/Enums/UserRoles'

export const TicketResponseFactory = Factory.define(TicketResponse, async ({ faker }) => {
  const ticketIds: number[] = (await Ticket.all()).map((ticket: Ticket) => ticket.id)
  const users: User[] = await User.query().preload('userRole')

  const usersWithRoles = users.map((user: User) => ({
    id: user.id,
    isSupport: user.userRole.name !== UserRoles.CLIENT,
  }))

  const randomUserWithRole = faker.helpers.arrayElement(usersWithRoles)

  return {
    content: faker.lorem.paragraph(),
    users_id: randomUserWithRole.id,
    is_support: randomUserWithRole.isSupport,
    tickets_id: faker.helpers.arrayElement(ticketIds),
  }
}).build()
