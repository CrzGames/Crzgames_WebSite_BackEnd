import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Product from 'App/Models/Product'
import { DateTime } from 'luxon'

export default class GameServer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public region: string | null

  @manyToMany(() => Product, {
    pivotTable: 'product_game_servers',
    pivotForeignKey: 'game_servers_id',
    pivotRelatedForeignKey: 'products_id',
  })
  public products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
