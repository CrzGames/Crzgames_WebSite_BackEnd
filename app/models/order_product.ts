import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Order from '#models/order'
import Product from '#models/product'
import { DateTime } from 'luxon'
import GameServer from '#models/game_server'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class OrderProduct extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public orders_id: number

  @belongsTo(() => Order, {
    foreignKey: 'orders_id',
  })
  declare public order: BelongsTo<typeof Order>

  @column()
  declare public products_id: number

  @belongsTo(() => Product, {
    foreignKey: 'products_id',
  })
  declare public product: BelongsTo<typeof Product>

  @column()
  declare public game_servers_id: number | null

  @belongsTo(() => GameServer, {
    foreignKey: 'game_servers_id',
  })
  declare public gameServer: BelongsTo<typeof GameServer>

  @column()
  declare public quantity: number

  @column()
  declare public price: number

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
