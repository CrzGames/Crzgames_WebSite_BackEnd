import { belongsTo } from '@adonisjs/lucid/orm'
import Game from '#models/game'

import GameCategory from '#models/game_category'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { GameCategoryAssignmentSchema } from '#database/schema'

export default class GameCategoryAssignment extends GameCategoryAssignmentSchema {
  @belongsTo(() => Game, {
    foreignKey: 'gamesId',
  })
  declare public game: BelongsTo<typeof Game>

  @belongsTo(() => GameCategory, {
    foreignKey: 'gameCategoriesId',
  })
  declare public gameCategory: BelongsTo<typeof GameCategory>
}

