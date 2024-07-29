import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import type { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import TicketCategory from 'App/Models/TicketCategory'
import TicketStatus from 'App/Models/TicketStatus'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public subject: string

  @column()
  public ticket_statuses_id: number

  @belongsTo(() => TicketStatus, {
    foreignKey: 'ticket_statuses_id',
  })
  public ticketStatus: BelongsTo<typeof TicketStatus>

  @column()
  public users_id: number

  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  public user: BelongsTo<typeof User>

  @column()
  public ticket_categories_id: number

  @belongsTo(() => TicketCategory, {
    foreignKey: 'ticket_categories_id',
  })
  public ticketCategory: BelongsTo<typeof TicketCategory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
