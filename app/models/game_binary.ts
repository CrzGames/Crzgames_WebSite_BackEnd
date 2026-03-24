import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import GamePlatform from '#models/game_platform'

import Game from '#models/game'

import File from '#models/file'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import { GameBinarySchema } from '#database/schema'

export default class GameBinary extends GameBinarySchema {
  @belongsTo(() => GamePlatform, {
    foreignKey: 'game_platforms_id',
  })
  declare public gamePlatform: BelongsTo<typeof GamePlatform>

  @manyToMany(() => Game, {
    pivotTable: 'game_binary_assignments',
  })
  declare public game: ManyToMany<typeof Game>

  @belongsTo(() => File, {
    foreignKey: 'files_id',
  })
  declare public file: BelongsTo<typeof File>
}
