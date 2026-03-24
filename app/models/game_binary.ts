import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import GamePlatform from '#models/game_platform'

import Game from '#models/game'

import File from '#models/file'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import { GameBinarySchema } from '#database/schema'

export default class GameBinary extends GameBinarySchema {
  @belongsTo(() => GamePlatform, {
    foreignKey: 'gamePlatformsId',
  })
  declare public gamePlatform: BelongsTo<typeof GamePlatform>

  @manyToMany(() => Game, {
    pivotTable: 'game_binary_assignments',
    pivotForeignKey: 'game_binaries_id',
    pivotRelatedForeignKey: 'games_id',
  })
  declare public game: ManyToMany<typeof Game>

  @belongsTo(() => File, {
    foreignKey: 'filesId',
  })
  declare public file: BelongsTo<typeof File>
}
