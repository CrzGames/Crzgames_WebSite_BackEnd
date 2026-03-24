import { belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'

import TicketCategory from '#models/ticket_category'

import TicketStatus from '#models/ticket_status'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { TicketSchema } from '#database/schema'

export default class Ticket extends TicketSchema {
  @belongsTo(() => TicketStatus, {
    foreignKey: 'ticketStatusesId',
  })
  declare public ticketStatus: BelongsTo<typeof TicketStatus>

  @belongsTo(() => User, {
    foreignKey: 'usersId',
  })
  declare public user: BelongsTo<typeof User>

  @belongsTo(() => TicketCategory, {
    foreignKey: 'ticketCategoriesId',
  })
  declare public ticketCategory: BelongsTo<typeof TicketCategory>
}

