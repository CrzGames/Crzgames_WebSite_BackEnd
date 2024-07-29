import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import File from 'App/Models/File'
import Game from 'App/Models/Game'
import ProductDiscount from 'App/Models/ProductDiscount'
import OrderProduct from 'App/Models/OrderProduct'
import { DateTime } from 'luxon'
import ProductCategory from 'App/Models/ProductCategory'
import GameServer from 'App/Models/GameServer'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public price: number // Prix en euros

  @column()
  public product_categories_id: number | null

  @belongsTo(() => ProductCategory, {
    foreignKey: 'product_categories_id',
  })
  public productCategory: BelongsTo<typeof ProductCategory>

  @manyToMany(() => GameServer, {
    pivotTable: 'product_game_servers',
    pivotForeignKey: 'products_id',
    pivotRelatedForeignKey: 'game_servers_id',
  })
  public gameServers: ManyToMany<typeof GameServer>

  @column()
  public image_files_id: number

  @belongsTo(() => File, {
    foreignKey: 'image_files_id',
  })
  public imageFile: BelongsTo<typeof File>

  @column()
  public games_id: number | null

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  public game: BelongsTo<typeof Game>

  @hasMany(() => ProductDiscount, {
    foreignKey: 'products_id',
  })
  public productDiscounts: HasMany<typeof ProductDiscount>

  @hasMany(() => OrderProduct, {
    foreignKey: 'products_id',
  })
  public orderProducts: HasMany<typeof OrderProduct>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
