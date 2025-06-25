import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import GamePlatform from '#models/game_platform'
import Game from '#models/game'
import File from '#models/file'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class GameBinary extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public game_platforms_id: number

  @belongsTo(() => GamePlatform, {
    foreignKey: 'game_platforms_id',
  })
  declare public gamePlatform: BelongsTo<typeof GamePlatform>

  @manyToMany(() => Game, {
    pivotTable: 'game_binary_assignments',
  })
  declare public game: ManyToMany<typeof Game>

  @column()
  declare public files_id: number

  @belongsTo(() => File, {
    foreignKey: 'files_id',
  })
  declare public file: BelongsTo<typeof File>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
