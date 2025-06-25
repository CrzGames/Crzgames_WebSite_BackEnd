import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Ticket from '#models/ticket'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { ModelObject } from '@adonisjs/lucid/types/model'

export default class TicketResponse extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public content: string

  @column()
  declare public users_id: number

  @column()
  declare public is_support: boolean

  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  declare public user: BelongsTo<typeof User>

  @column()
  declare public tickets_id: number

  @belongsTo(() => Ticket, {
    foreignKey: 'tickets_id',
  })
  declare public ticket: BelongsTo<typeof Ticket>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  /**
   * Surcharge de la sérialisation pour convertir les champs en booléens explicites
   * lors de la sérialisation en JSON de la response
   * @returns {ModelObject} - L'objet sérialisé avec les champs booléens explicites
   */
  public serialize(): ModelObject {
    const serialized: ModelObject = super.serialize()

    return {
      ...serialized,
      is_support: !!serialized.is_support,
    } as ModelObject
  }
}
