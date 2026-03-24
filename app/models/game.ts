import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import File from '#models/file'

import GameCategory from '#models/game_category'

import GamePlatform from '#models/game_platform'

import GameBinary from '#models/game_binary'

import GameVersion from '#models/game_version'

import Language from '#models/language'

import GameConfiguration from '#models/game_configuration'

import GameMedia from '#models/game_media'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import type { HasMany } from '@adonisjs/lucid/types/relations'

import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import { ModelObject } from '@adonisjs/lucid/types/model'

import { GameSchema } from '#database/schema'

export default class Game extends GameSchema {
  @hasMany(() => GameVersion, {
    foreignKey: 'gamesId',
  })
  declare public gameVersions: HasMany<typeof GameVersion>

  @manyToMany(() => GamePlatform, {
    pivotTable: 'game_platform_assignments',

    pivotForeignKey: 'games_id',

    pivotRelatedForeignKey: 'game_platforms_id',
  })
  declare public gamePlatform: ManyToMany<typeof GamePlatform>
  @manyToMany(() => GameBinary, {
    pivotTable: 'game_binary_assignments',

    pivotForeignKey: 'games_id',

    pivotRelatedForeignKey: 'game_binaries_id',
  })
  declare public gameBinary: ManyToMany<typeof GameBinary>
  @manyToMany(() => GameCategory, {
    pivotTable: 'game_category_assignments',

    pivotForeignKey: 'games_id',

    pivotRelatedForeignKey: 'game_categories_id',
  })
  declare public gameCategory: ManyToMany<typeof GameCategory>
  @belongsTo(() => File, {
    foreignKey: 'trailerFilesId',
  })
  declare public trailerFile: BelongsTo<typeof File>

  @belongsTo(() => File, {
    foreignKey: 'pictureFilesId',
  })
  declare public pictureFile: BelongsTo<typeof File>

  @belongsTo(() => File, {
    foreignKey: 'logoFilesId',
  })
  declare public logoFile: BelongsTo<typeof File>

  @belongsTo(() => GameConfiguration, { foreignKey: 'gameConfigurationsMinimalId' })
  declare public gameConfigurationMinimal: BelongsTo<typeof GameConfiguration>

  @belongsTo(() => GameConfiguration, { foreignKey: 'gameConfigurationsRecommendedId' })
  declare public gameConfigurationRecommended: BelongsTo<typeof GameConfiguration>

  @manyToMany(() => Language, {
    pivotTable: 'game_languages',

    pivotForeignKey: 'games_id',

    pivotRelatedForeignKey: 'languages_id',
  })
  declare public languages: ManyToMany<typeof Language>
  @hasMany(() => GameMedia, {
    foreignKey: 'gamesId',
  })
  declare public gameMedias: HasMany<typeof GameMedia>

  /**
   * Surcharge de la sérialisation pour convertir les champs en booléens explicites
   * lors de la sérialisation en JSON de la response
   * @returns {ModelObject} - L'objet sérialisé avec les champs booléens
   */
  public serialize(): ModelObject {
    const serialized: ModelObject = super.serialize()
    const upcomingGameRaw: unknown = serialized.upcomingGame ?? serialized.upcoming_game
    const newGameRaw: unknown = serialized.newGame ?? serialized.new_game

    const upcomingGame: boolean | null = upcomingGameRaw === null ? null : Boolean(upcomingGameRaw)
    const newGame: boolean | null = newGameRaw === null ? null : Boolean(newGameRaw)

    return {
      ...serialized,
      upcomingGame,
      newGame,
      upcoming_game: upcomingGame,
      new_game: newGame,
    } as ModelObject
  }
}
