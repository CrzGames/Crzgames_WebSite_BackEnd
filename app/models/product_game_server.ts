import { belongsTo } from '@adonisjs/lucid/orm'

import Product from '#models/product'

import GameServer from '#models/game_server'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { ProductGameServerSchema } from '#database/schema'

export default class ProductGameServer extends ProductGameServerSchema {
  @belongsTo(() => Product, {
    foreignKey: 'productsId',
  })
  declare public product: BelongsTo<typeof Product>

  @belongsTo(() => GameServer, {
    foreignKey: 'gameServersId',
  })
  declare public gameServer: BelongsTo<typeof GameServer>
}

