import { DateTime } from 'luxon'
import { column, belongsTo, BaseModel } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class PasswordResetToken extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public users_id: number

  @belongsTo(() => User)
  declare public user: BelongsTo<typeof User>

  @column()
  declare public token: string

  @column.dateTime()
  declare public expires_at: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
