import { hasMany } from '@adonisjs/lucid/orm'
import Product from '#models/product'

import type { HasMany } from '@adonisjs/lucid/types/relations'

import { ProductCategorySchema } from '#database/schema'

export default class ProductCategory extends ProductCategorySchema {
  @hasMany(() => Product, {
    foreignKey: 'productCategoriesId',
  })
  declare public products: HasMany<typeof Product>
}

