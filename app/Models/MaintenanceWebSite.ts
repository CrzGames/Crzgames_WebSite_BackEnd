import { BaseModel, column, ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class MaintenanceWebSite extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public is_maintenance: boolean

  @column()
  public name: string

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
      is_maintenance: !!serialized.is_maintenance
    } as ModelObject
  }
}
