import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Game from '#models/game'
import GameCategory from '#models/game_category'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class GameCategoryAssignment extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public games_id: number

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

  @column()
  declare public game_categories_id: number

  @belongsTo(() => GameCategory, {
    foreignKey: 'game_categories_id',
  })
  declare public gameCategory: BelongsTo<typeof GameCategory>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
