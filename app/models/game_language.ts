import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class GameLanguage extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public games_id: number

  @column()
  declare public languages_id: number

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
