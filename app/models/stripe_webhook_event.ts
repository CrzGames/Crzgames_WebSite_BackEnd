import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class StripeWebhookEvent extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public stripe_event_id: string

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
