import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Game from 'App/Models/Game'
import GameBinary from 'App/Models/GameBinary'

export default class GameBinaryAssignment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public games_id: number

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  public game: BelongsTo<typeof Game>

  @column()
  public game_binaries_id: number

  @belongsTo(() => GameBinary, {
    foreignKey: 'game_binaries_id',
  })
  public gameBinary: BelongsTo<typeof GameBinary>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
