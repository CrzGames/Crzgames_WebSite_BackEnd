import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Order from 'App/Models/Order'
import Product from 'App/Models/Product'
import { DateTime } from 'luxon'
import GameServer from 'App/Models/GameServer'

export default class OrderProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public orders_id: number

  @belongsTo(() => Order, {
    foreignKey: 'orders_id',
  })
  public order: BelongsTo<typeof Order>

  @column()
  public products_id: number

  @belongsTo(() => Product, {
    foreignKey: 'products_id',
  })
  public product: BelongsTo<typeof Product>

  @column()
  public game_servers_id: number | null

  @belongsTo(() => GameServer, {
    foreignKey: 'game_servers_id',
  })
  public gameServer: BelongsTo<typeof GameServer>

  @column()
  public quantity: number

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
