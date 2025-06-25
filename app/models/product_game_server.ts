import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Product from '#models/product'
import GameServer from '#models/game_server'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ProductGameServer extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public products_id: number

  @belongsTo(() => Product, {
    foreignKey: 'products_id',
  })
  declare public product: BelongsTo<typeof Product>

  @column()
  declare public game_servers_id: number

  @belongsTo(() => GameServer, {
    foreignKey: 'game_servers_id',
  })
  declare public gameServer: BelongsTo<typeof GameServer>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
