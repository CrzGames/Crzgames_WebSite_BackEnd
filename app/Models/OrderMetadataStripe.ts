import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class OrderMetadataStripe extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public users_id: number

  @column()
  public processed_items: string // JSON string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
