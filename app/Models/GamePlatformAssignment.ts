import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Game from 'App/Models/Game'
import GamePlatform from 'App/Models/GamePlatform'

export default class GamePlatformAssignment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public games_id: number

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  public game: BelongsTo<typeof Game>

  @column()
  public game_platforms_id: number

  @belongsTo(() => GamePlatform, {
    foreignKey: 'game_platforms_id',
  })
  public gamePlatform: BelongsTo<typeof GamePlatform>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
