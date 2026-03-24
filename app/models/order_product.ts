import { belongsTo } from '@adonisjs/lucid/orm'
import Order from '#models/order'

import Product from '#models/product'

import GameServer from '#models/game_server'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { OrderProductSchema } from '#database/schema'

export default class OrderProduct extends OrderProductSchema {
  @belongsTo(() => Order, {
    foreignKey: 'ordersId',
  })
  declare public order: BelongsTo<typeof Order>

  @belongsTo(() => Product, {
    foreignKey: 'productsId',
  })
  declare public product: BelongsTo<typeof Product>

  @belongsTo(() => GameServer, {
    foreignKey: 'gameServersId',
  })
  declare public gameServer: BelongsTo<typeof GameServer>
}

