import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Game from '#models/game'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class GameChangeLog extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public games_id: number

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

  @column()
  declare public version: string

  @column.dateTime({ autoCreate: true })
  declare public release_date: DateTime

  @column()
  declare public content: string

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
