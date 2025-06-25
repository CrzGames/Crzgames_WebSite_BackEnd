import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ChatBlocked extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public blocker_users_id: number

  @belongsTo(() => User, {
    foreignKey: 'blocker_users_id',
  })
  declare public blockerUser: BelongsTo<typeof User>

  @column()
  declare public blocked_users_id: number

  @belongsTo(() => User, {
    foreignKey: 'blocked_users_id',
  })
  declare public blockedUser: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
