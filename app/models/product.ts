import { BaseModel, column, hasMany, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import File from '#models/file'
import Game from '#models/game'
import ProductDiscount from '#models/product_discount'
import OrderProduct from '#models/order_product'
import { DateTime } from 'luxon'
import ProductCategory from '#models/product_category'
import GameServer from '#models/game_server'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public name: string

  @column()
  declare public description: string

  @column()
  declare public price: number // Prix en euros

  @column()
  declare public product_categories_id: number | null

  @belongsTo(() => ProductCategory, {
    foreignKey: 'product_categories_id',
  })
  declare public productCategory: BelongsTo<typeof ProductCategory>

  @manyToMany(() => GameServer, {
    pivotTable: 'product_game_servers',
    pivotForeignKey: 'products_id',
    pivotRelatedForeignKey: 'game_servers_id',
  })
  declare public gameServers: ManyToMany<typeof GameServer>

  @column()
  declare public image_files_id: number

  @belongsTo(() => File, {
    foreignKey: 'image_files_id',
  })
  declare public imageFile: BelongsTo<typeof File>

  @column()
  declare public games_id: number | null

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

  @hasMany(() => ProductDiscount, {
    foreignKey: 'products_id',
  })
  declare public productDiscounts: HasMany<typeof ProductDiscount>

  @hasMany(() => OrderProduct, {
    foreignKey: 'products_id',
  })
  declare public orderProducts: HasMany<typeof OrderProduct>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
