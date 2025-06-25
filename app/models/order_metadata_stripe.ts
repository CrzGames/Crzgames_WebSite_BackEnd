import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class OrderMetadataStripe extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public users_id: number

  @column()
  declare public processed_items: string // JSON string

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
