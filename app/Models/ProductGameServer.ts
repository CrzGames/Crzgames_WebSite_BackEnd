import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Product from 'App/Models/Product'
import GameServer from 'App/Models/GameServer'

export default class ProductGameServer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public products_id: number

  @belongsTo(() => Product, {
    foreignKey: 'products_id',
  })
  public product: BelongsTo<typeof Product>

  @column()
  public game_servers_id: number

  @belongsTo(() => GameServer, {
    foreignKey: 'game_servers_id',
  })
  public gameServer: BelongsTo<typeof GameServer>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
