import { belongsTo } from '@adonisjs/lucid/orm'
import Game from '#models/game'

import GameCategory from '#models/game_category'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { GameCategoryAssignmentSchema } from '#database/schema'

export default class GameCategoryAssignment extends GameCategoryAssignmentSchema {
  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

  @belongsTo(() => GameCategory, {
    foreignKey: 'game_categories_id',
  })
  declare public gameCategory: BelongsTo<typeof GameCategory>
}
