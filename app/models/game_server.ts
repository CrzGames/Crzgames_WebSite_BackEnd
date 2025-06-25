import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import { DateTime } from 'luxon'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class GameServer extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public name: string

  @column()
  declare public region: string | null

  @manyToMany(() => Product, {
    pivotTable: 'product_game_servers',
    pivotForeignKey: 'game_servers_id',
    pivotRelatedForeignKey: 'products_id',
  })
  declare public products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
