import { ModelObject } from '@adonisjs/lucid/types/model'

import { GameConfigurationSchema } from '#database/schema'

export default class GameConfiguration extends GameConfigurationSchema {
  /**
   * Surcharge de la sérialisation pour convertir les champs en booléens explicites
   * lors de la sérialisation en JSON de la response
   * @returns {ModelObject} - L'objet sérialisé avec les champs convertis
   */
  public serialize(): ModelObject {
    const serialized: ModelObject = super.serialize()

    return {
      ...serialized,
      internet: serialized.internet === null ? null : !!serialized.internet,
    } as ModelObject
  }
}
