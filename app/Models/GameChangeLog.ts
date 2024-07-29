import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Game from 'App/Models/Game'

export default class GameChangeLog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public games_id: number

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  public game: BelongsTo<typeof Game>

  @column()
  public version: string

  @column.dateTime({ autoCreate: true })
  public release_date: DateTime

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
