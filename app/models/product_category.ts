import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class ProductCategory extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public name: string

  @hasMany(() => Product, {
    foreignKey: 'product_categories_id',
  })
  declare public products: HasMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
