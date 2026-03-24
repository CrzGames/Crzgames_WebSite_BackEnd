import { belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'

import TicketCategory from '#models/ticket_category'

import TicketStatus from '#models/ticket_status'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { TicketSchema } from '#database/schema'

export default class Ticket extends TicketSchema {
  @belongsTo(() => TicketStatus, {
    foreignKey: 'ticket_statuses_id',
  })
  declare public ticketStatus: BelongsTo<typeof TicketStatus>

  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  declare public user: BelongsTo<typeof User>

  @belongsTo(() => TicketCategory, {
    foreignKey: 'ticket_categories_id',
  })
  declare public ticketCategory: BelongsTo<typeof TicketCategory>
}
