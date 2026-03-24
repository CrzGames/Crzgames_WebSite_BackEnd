import { belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'

import Ticket from '#models/ticket'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { ModelObject } from '@adonisjs/lucid/types/model'

import { TicketResponseSchema } from '#database/schema'

export default class TicketResponse extends TicketResponseSchema {
  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  declare public user: BelongsTo<typeof User>

  @belongsTo(() => Ticket, {
    foreignKey: 'tickets_id',
  })
  declare public ticket: BelongsTo<typeof Ticket>

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
