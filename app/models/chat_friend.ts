import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ChatFriend extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public users_id: number

  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  declare public user: BelongsTo<typeof User>

  @column()
  declare public friend_users_id: number

  @belongsTo(() => User, {
    foreignKey: 'friend_users_id',
  })
  declare public friendUser: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
