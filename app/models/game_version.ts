import { belongsTo } from '@adonisjs/lucid/orm'
import Game from '#models/game'

import { ModelObject } from '@adonisjs/lucid/types/model'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { GameVersionSchema } from '#database/schema'

export default class GameVersion extends GameVersionSchema {
  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

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
