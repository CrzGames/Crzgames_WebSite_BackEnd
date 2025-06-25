import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import File from '#models/file'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Carousel extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public title: string | null

  @column()
  declare public content: string | null

  @column()
  declare public button_url: string | null

  @column()
  declare public button_content: string | null

  @column()
  declare public image_files_id: number

  @belongsTo(() => File, {
    foreignKey: 'image_files_id',
  })
  declare public imageFile: BelongsTo<typeof File>

  @column()
  declare public logo_files_id: number | null

  @belongsTo(() => File, {
    foreignKey: 'logo_files_id',
  })
  declare public logoFile: BelongsTo<typeof File>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
