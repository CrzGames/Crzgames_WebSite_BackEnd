import { belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'

import Game from '#models/game'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { UserGameLibrarySchema } from '#database/schema'

export default class UserGameLibrary extends UserGameLibrarySchema {
  @belongsTo(() => User, {
    foreignKey: 'usersId',
  })
  declare public user: BelongsTo<typeof User>

  @belongsTo(() => Game, {
    foreignKey: 'gamesId',
  })
  declare public game: BelongsTo<typeof Game>
}
