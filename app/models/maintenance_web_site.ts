import { ModelObject } from '@adonisjs/lucid/types/model'

import { MaintenanceWebSiteSchema } from '#database/schema'

export default class MaintenanceWebSite extends MaintenanceWebSiteSchema {
  /**
   * Surcharge de la sérialisation pour convertir les champs en booléens explicites
   * lors de la sérialisation en JSON de la response
   * @returns {ModelObject} - L'objet sérialisé avec les champs convertis
   */
  public serialize(): ModelObject {
    const serialized: ModelObject = super.serialize()

    return {
      ...serialized,
      is_maintenance: !!serialized.is_maintenance,
    } as ModelObject
  }
}
