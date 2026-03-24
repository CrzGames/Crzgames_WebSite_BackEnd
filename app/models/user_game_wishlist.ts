import { belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'

import Game from '#models/game'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { UserGameWishlistSchema } from '#database/schema'

export default class UserGameWishlist extends UserGameWishlistSchema {
  @belongsTo(() => User, {
    foreignKey: 'users_id',
  })
  declare public user: BelongsTo<typeof User>

  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>
}
