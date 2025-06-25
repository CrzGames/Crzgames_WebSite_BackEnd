import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Game from '#models/game'
import File from '#models/file'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class GameMedia extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public games_id: number

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

  @column()
  declare public files_id: number

  @belongsTo(() => File, {
    foreignKey: 'files_id',
  })
  declare public file: BelongsTo<typeof File>

  @column()
  declare public type: 'screenshot' | 'trailer' | 'gameplay'

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
