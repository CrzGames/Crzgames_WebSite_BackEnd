import { manyToMany } from '@adonisjs/lucid/orm'
import Product from '#models/product'

import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import { GameServerSchema } from '#database/schema'

export default class GameServer extends GameServerSchema {
  @manyToMany(() => Product, {
    pivotTable: 'product_game_servers',

    pivotForeignKey: 'game_servers_id',

    pivotRelatedForeignKey: 'products_id',
  })
  declare public products: ManyToMany<typeof Product>
}
