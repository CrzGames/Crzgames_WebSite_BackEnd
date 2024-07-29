import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class ChatBlocked extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public blocker_users_id: number

  @belongsTo(() => User, {
    foreignKey: 'blocker_users_id',
  })
  public blockerUser: BelongsTo<typeof User>

  @column()
  public blocked_users_id: number

  @belongsTo(() => User, {
    foreignKey: 'blocked_users_id',
  })
  public blockedUser: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
