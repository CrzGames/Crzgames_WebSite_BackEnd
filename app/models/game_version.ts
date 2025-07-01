import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Game from '#models/game'
import { DateTime } from 'luxon'
import { ModelObject } from '@adonisjs/lucid/types/model'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class GameVersion extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public version: string

  @column()
  declare public is_available: boolean

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

  @column()
  declare public games_id: number

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  /**
   * Surcharge de la sérialisation pour convertir les champs en booléens explicites
   * lors de la sérialisation en JSON de la response
   * @returns {ModelObject} - L'objet sérialisé avec les champs convertis
   */
  public serialize(): ModelObject {
    const serialized: ModelObject = super.serialize()

    return {
      ...serialized,
      is_available: !!serialized.is_available,
    } as ModelObject
  }
}
