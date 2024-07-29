import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class MaintenanceWebSite extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({
    // Force the value to be a boolean, ne pas simplifier la methode laisser le ternaire
    serialize: (value: boolean): boolean => (value ? true : false),
  })
  public is_maintenance: boolean

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
