import { belongsTo } from '@adonisjs/lucid/orm'

import Product from '#models/product'

import GameServer from '#models/game_server'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { ProductGameServerSchema } from '#database/schema'

export default class ProductGameServer extends ProductGameServerSchema {
  @belongsTo(() => Product, {
    foreignKey: 'products_id',
  })
  declare public product: BelongsTo<typeof Product>

  @belongsTo(() => GameServer, {
    foreignKey: 'game_servers_id',
  })
  declare public gameServer: BelongsTo<typeof GameServer>
}
