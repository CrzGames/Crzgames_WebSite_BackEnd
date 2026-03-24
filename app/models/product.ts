import { hasMany, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import File from '#models/file'

import Game from '#models/game'

import ProductDiscount from '#models/product_discount'

import OrderProduct from '#models/order_product'

import ProductCategory from '#models/product_category'

import GameServer from '#models/game_server'

import type { HasMany } from '@adonisjs/lucid/types/relations'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import { ProductSchema } from '#database/schema'

export default class Product extends ProductSchema {
  @belongsTo(() => ProductCategory, {
    foreignKey: 'productCategoriesId',
  })
  declare public productCategory: BelongsTo<typeof ProductCategory>

  @manyToMany(() => GameServer, {
    pivotTable: 'product_game_servers',

    pivotForeignKey: 'products_id',

    pivotRelatedForeignKey: 'game_servers_id',
  })
  declare public gameServers: ManyToMany<typeof GameServer>

  @belongsTo(() => File, {
    foreignKey: 'imageFilesId',
  })
  declare public imageFile: BelongsTo<typeof File>

  @belongsTo(() => Game, {
    foreignKey: 'gamesId',
  })
  declare public game: BelongsTo<typeof Game>

  @hasMany(() => ProductDiscount, {
    foreignKey: 'productsId',
  })
  declare public productDiscounts: HasMany<typeof ProductDiscount>

  @hasMany(() => OrderProduct, {
    foreignKey: 'productsId',
  })
  declare public orderProducts: HasMany<typeof OrderProduct>
}
