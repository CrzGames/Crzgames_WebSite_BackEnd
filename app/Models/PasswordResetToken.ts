import { DateTime } from 'luxon'
import { column, belongsTo, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import type { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class PasswordResetToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public users_id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public token: string

  @column.dateTime()
  public expires_at: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
