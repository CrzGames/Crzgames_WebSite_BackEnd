import { BaseModel, column, belongsTo, BelongsTo, ModelObject } from '@ioc:Adonis/Lucid/Orm'
import Game from 'App/Models/Game'
import { DateTime } from 'luxon'

export default class GameVersion extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public version: string

  @column()
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

  /**
   * Surcharge de la sérialisation pour convertir les champs en booléens explicites
   * lors de la sérialisation en JSON de la response
   */
  public serialize(): ModelObject {
    const serialized: ModelObject = super.serialize()

    return {
      ...serialized,
      isAvailable: !!serialized.isAvailable,
    } as ModelObject
  }
}
