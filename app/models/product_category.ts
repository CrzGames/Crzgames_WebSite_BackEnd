import { hasMany } from '@adonisjs/lucid/orm'
import Product from '#models/product'

import type { HasMany } from '@adonisjs/lucid/types/relations'

import { ProductCategorySchema } from '#database/schema'

export default class ProductCategory extends ProductCategorySchema {
  @hasMany(() => Product, {
    foreignKey: 'product_categories_id',
  })
  declare public products: HasMany<typeof Product>
}
