import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Game from '#models/game'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class UserGameLibrary extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column({})
  declare public users_id: number

  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  declare public user: BelongsTo<typeof User>

  @column()
  declare public games_id: number

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
