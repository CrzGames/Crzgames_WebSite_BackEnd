import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import File from 'App/Models/File'

export default class Carousel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string | null

  @column()
  public content: string | null

  @column()
  public button_url: string | null

  @column()
  public button_content: string | null

  @column()
  public image_files_id: number

  @belongsTo(() => File, {
    foreignKey: 'image_files_id',
  })
  public imageFile: BelongsTo<typeof File>

  @column()
  public logo_files_id: number | null

  @belongsTo(() => File, {
    foreignKey: 'logo_files_id',
  })
  public logoFile: BelongsTo<typeof File>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
