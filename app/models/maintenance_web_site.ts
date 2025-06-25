import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { ModelObject } from '@adonisjs/lucid/types/model'

export default class MaintenanceWebSite extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public is_maintenance: boolean

  @column()
  declare public name: string

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
      is_maintenance: !!serialized.is_maintenance,
    } as ModelObject
  }
}
