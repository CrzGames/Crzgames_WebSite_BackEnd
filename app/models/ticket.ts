import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import TicketCategory from '#models/ticket_category'
import TicketStatus from '#models/ticket_status'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public subject: string

  @column()
  declare public ticket_statuses_id: number

  @belongsTo(() => TicketStatus, {
    foreignKey: 'ticket_statuses_id',
  })
  declare public ticketStatus: BelongsTo<typeof TicketStatus>

  @column()
  declare public users_id: number

  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  declare public user: BelongsTo<typeof User>

  @column()
  declare public ticket_categories_id: number

  @belongsTo(() => TicketCategory, {
    foreignKey: 'ticket_categories_id',
  })
  declare public ticketCategory: BelongsTo<typeof TicketCategory>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
