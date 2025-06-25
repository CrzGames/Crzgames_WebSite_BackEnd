import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ProductDiscount extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public products_id: number

  @belongsTo(() => Product, {
    foreignKey: 'products_id',
  })
  declare public product: BelongsTo<typeof Product>

  @column()
  declare public currency: string

  @column()
  declare public discount_percent: number

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
