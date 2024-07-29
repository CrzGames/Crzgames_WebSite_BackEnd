import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class ChatFriendRequest extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sender_users_id: number

  @belongsTo(() => User, {
    foreignKey: 'sender_users_id',
  })
  public senderUser: BelongsTo<typeof User>

  @column()
  public receiver_users_id: number

  @belongsTo(() => User, {
    foreignKey: 'receiver_users_id',
  })
  public receiverUser: BelongsTo<typeof User>

  @column()
  public status: 'pending' | 'accepted' | 'declined'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
