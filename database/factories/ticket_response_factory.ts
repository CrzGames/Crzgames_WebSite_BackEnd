import factory from '@adonisjs/lucid/factories'
import TicketResponse from '#models/ticket_response'
import User from '#models/user'
import Ticket from '#models/ticket'
import { UserRoles } from '#enums/user_roles'

export const TicketResponseFactory = factory
  .define(TicketResponse, async ({ faker }) => {
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
  })
  .build()
