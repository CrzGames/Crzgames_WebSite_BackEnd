import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import OrderProduct from '#models/order_product'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public users_id: number

  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  declare public user: BelongsTo<typeof User>

  @column()
  declare public currency: string

  @column()
  declare public total_price: number

  @column()
  declare public status_order: 'Paid' | 'Canceled' | 'Failed'

  @column()
  declare public payment_intent_id: string

  @hasMany(() => OrderProduct, {
    foreignKey: 'orders_id',
  })
  declare public orderProducts: HasMany<typeof OrderProduct>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
