import { belongsTo } from '@adonisjs/lucid/orm'
import Game from '#models/game'

import GameBinary from '#models/game_binary'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { GameBinaryAssignmentSchema } from '#database/schema'

export default class GameBinaryAssignment extends GameBinaryAssignmentSchema {
  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

  @belongsTo(() => GameBinary, {
    foreignKey: 'game_binaries_id',
  })
  declare public gameBinary: BelongsTo<typeof GameBinary>
}
