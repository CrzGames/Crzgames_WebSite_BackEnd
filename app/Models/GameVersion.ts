import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Game from 'App/Models/Game'
import { DateTime } from 'luxon'

export default class GameVersion extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public version: string

  @column({
    // Force the value to be a boolean, ne pas simplifier la methode laisser le ternaire
    serialize: (value: boolean): boolean => (value ? true : false),
  })
  public isAvailable: boolean

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  public game: BelongsTo<typeof Game>

  @column()
  public games_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
