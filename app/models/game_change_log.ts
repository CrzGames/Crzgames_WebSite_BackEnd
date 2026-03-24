import { belongsTo } from '@adonisjs/lucid/orm'
import Game from '#models/game'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { GameChangeLogSchema } from '#database/schema'

export default class GameChangeLog extends GameChangeLogSchema {
  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>
}
