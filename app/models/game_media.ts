import { belongsTo } from '@adonisjs/lucid/orm'
import Game from '#models/game'

import File from '#models/file'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { GameMediaSchema } from '#database/schema'

export default class GameMedia extends GameMediaSchema {
  @belongsTo(() => Game, {
    foreignKey: 'gamesId',
  })
  declare public game: BelongsTo<typeof Game>

  @belongsTo(() => File, {
    foreignKey: 'filesId',
  })
  declare public file: BelongsTo<typeof File>
}

