import { BaseModel, column, ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class GameConfiguration extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: 'minimal' | 'recommended'

  @column()
  public cpu_intel: string

  @column()
  public cpu_amd: string

  @column()
  public gpu_nvidia: string

  @column()
  public gpu_amd: string

  @column()
  public ram: string

  @column()
  public storage: string

  @column()
  public os: string

  @column()
  public internet: boolean | null

  @column()
  public additional_notes: string | null

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
      internet: serialized.internet === null ? null : !!serialized.internet,
    } as ModelObject
  }
}
