import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class ChatFriend extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public users_id: number

  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  public user: BelongsTo<typeof User>

  @column()
  public friend_users_id: number

  @belongsTo(() => User, {
    foreignKey: 'friend_users_id',
  })
  public friendUser: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
