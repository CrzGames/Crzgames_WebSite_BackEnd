import { hasMany, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'

import OrderProduct from '#models/order_product'

import type { HasMany } from '@adonisjs/lucid/types/relations'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { OrderSchema } from '#database/schema'

export default class Order extends OrderSchema {
  @belongsTo(() => User, {
    foreignKey: 'usersId',
  })
  declare public user: BelongsTo<typeof User>

  @hasMany(() => OrderProduct, {
    foreignKey: 'ordersId',
  })
  declare public orderProducts: HasMany<typeof OrderProduct>
}

