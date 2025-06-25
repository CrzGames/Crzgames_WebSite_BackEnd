import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Game from '#models/game'
import GameBinary from '#models/game_binary'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class GameBinaryAssignment extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public games_id: number

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

  @column()
  declare public game_binaries_id: number

  @belongsTo(() => GameBinary, {
    foreignKey: 'game_binaries_id',
  })
  declare public gameBinary: BelongsTo<typeof GameBinary>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
