import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Game from 'App/Models/Game'
import GameCategory from 'App/Models/GameCategory'

export default class GameCategoryAssignment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public games_id: number

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  public game: BelongsTo<typeof Game>

  @column()
  public game_categories_id: number

  @belongsTo(() => GameCategory, {
    foreignKey: 'game_categories_id',
  })
  public gameCategory: BelongsTo<typeof GameCategory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
