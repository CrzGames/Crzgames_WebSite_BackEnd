import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Language extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public code: string

  @column()
  declare public name: string

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
