import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ChatMessage extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public sender_users_id: number

  @belongsTo(() => User, {
    foreignKey: 'sender_users_id',
  })
  declare public senderUser: BelongsTo<typeof User>

  @column()
  declare public receiver_users_id: number

  @belongsTo(() => User, {
    foreignKey: 'receiver_users_id',
  })
  declare public receiverUser: BelongsTo<typeof User>

  @column()
  declare public content: string

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
