import { belongsTo } from '@adonisjs/lucid/orm'
import Game from '#models/game'

import GamePlatform from '#models/game_platform'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { GamePlatformAssignmentSchema } from '#database/schema'

export default class GamePlatformAssignment extends GamePlatformAssignmentSchema {
  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

  @belongsTo(() => GamePlatform, {
    foreignKey: 'game_platforms_id',
  })
  declare public gamePlatform: BelongsTo<typeof GamePlatform>
}
