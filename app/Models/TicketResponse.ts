import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Ticket from 'App/Models/Ticket'

export default class TicketResponse extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public content: string

  @column()
  public users_id: number

  @column({
    serialize: (value: number) => {
      return Boolean(value)
    },
  })
  public is_support: boolean

  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  public user: BelongsTo<typeof User>

  @column()
  public tickets_id: number

  @belongsTo(() => Ticket, {
    foreignKey: 'tickets_id',
  })
  public ticket: BelongsTo<typeof Ticket>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
