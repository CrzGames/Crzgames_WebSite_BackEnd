import { belongsTo } from '@adonisjs/lucid/orm'
import Game from '#models/game'

import File from '#models/file'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { GameMediaSchema } from '#database/schema'

export default class GameMedia extends GameMediaSchema {
  @belongsTo(() => Game, {
    foreignKey: 'games_id',
  })
  declare public game: BelongsTo<typeof Game>

  @belongsTo(() => File, {
    foreignKey: 'files_id',
  })
  declare public file: BelongsTo<typeof File>
}
