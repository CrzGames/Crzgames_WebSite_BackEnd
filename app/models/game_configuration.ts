import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { ModelObject } from '@adonisjs/lucid/types/model'

export default class GameConfiguration extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public type: 'minimal' | 'recommended'

  @column()
  declare public cpu_intel: string

  @column()
  declare public cpu_amd: string

  @column()
  declare public gpu_nvidia: string

  @column()
  declare public gpu_amd: string

  @column()
  declare public ram: string

  @column()
  declare public storage: string

  @column()
  declare public os: string

  @column()
  declare public internet: boolean | null

  @column()
  declare public additional_notes: string | null

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
      internet: serialized.internet === null ? null : !!serialized.internet,
    } as ModelObject
  }
}
