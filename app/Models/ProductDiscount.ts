import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Product from 'App/Models/Product'
import { DateTime } from 'luxon'

export default class ProductDiscount extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public products_id: number

  @belongsTo(() => Product, {
    foreignKey: 'products_id',
  })
  public product: BelongsTo<typeof Product>

  @column()
  public currency: string

  @column()
  public discount_percent: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
