import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Game from 'App/Models/Game'
import File from 'App/Models/File'

export default class GameMedia extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public games_id: number

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  public game: BelongsTo<typeof Game>

  @column()
  public files_id: number

  @belongsTo(() => File, {
    foreignKey: 'files_id',
  })
  public file: BelongsTo<typeof File>

  @column()
  public type: 'screenshot' | 'trailer' | 'gameplay'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
