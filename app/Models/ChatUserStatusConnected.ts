import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class ChatUserStatusConnected extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public users_id: number

  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  public user: BelongsTo<typeof User>

  @column()
  public status: 'online' | 'available' | 'invisible'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
