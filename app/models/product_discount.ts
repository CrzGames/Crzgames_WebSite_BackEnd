import { belongsTo } from '@adonisjs/lucid/orm'
import Product from '#models/product'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { ProductDiscountSchema } from '#database/schema'

export default class ProductDiscount extends ProductDiscountSchema {
  @belongsTo(() => Product, {
    foreignKey: 'products_id',
  })
  declare public product: BelongsTo<typeof Product>
}
