import { BaseModel, column, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import OrderProduct from 'App/Models/OrderProduct'
import { DateTime } from 'luxon'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public users_id: number

  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  public user: BelongsTo<typeof User>

  @column()
  public currency: string

  @column()
  public total_price: number

  @column()
  public status_order: 'Paid' | 'Canceled' | 'Failed'

  @column()
  public payment_intent_id: string

  @hasMany(() => OrderProduct, {
    foreignKey: 'orders_id',
  })
  public orderProducts: HasMany<typeof OrderProduct>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
