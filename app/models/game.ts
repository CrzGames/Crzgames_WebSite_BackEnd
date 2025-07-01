import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
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

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public title: string

  @hasMany(() => GameVersion, {
    foreignKey: 'games_id',
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

  @column()
  declare public trailer_files_id: number

  @belongsTo(() => File, {
    foreignKey: 'trailer_files_id',
  })
  declare public trailerFile: BelongsTo<typeof File>

  @column()
  declare public picture_files_id: number

  @belongsTo(() => File, {
    foreignKey: 'picture_files_id',
  })
  declare public pictureFile: BelongsTo<typeof File>

  @column()
  declare public logo_files_id: number

  @belongsTo(() => File, {
    foreignKey: 'logo_files_id',
  })
  declare public logoFile: BelongsTo<typeof File>

  @column()
  declare public description: string

  @column()
  declare public upcoming_game: boolean | null

  @column()
  declare public new_game: boolean | null

  @column.dateTime()
  declare public release_date: DateTime | null

  @column()
  declare public game_mode: 'solo' | 'multiplayer' | 'both'

  @column()
  declare public publisher: string

  @column()
  declare public developer: string

  @column()
  declare public game_configurations_minimal_id: number | null

  @belongsTo(() => GameConfiguration, { foreignKey: 'game_configurations_minimal_id' })
  declare public gameConfigurationMinimal: BelongsTo<typeof GameConfiguration>

  @column()
  declare public game_configurations_recommended_id: number | null

  @belongsTo(() => GameConfiguration, { foreignKey: 'game_configurations_recommended_id' })
  declare public gameConfigurationRecommended: BelongsTo<typeof GameConfiguration>

  @manyToMany(() => Language, {
    pivotTable: 'game_languages',
    pivotForeignKey: 'games_id',
    pivotRelatedForeignKey: 'languages_id',
  })
  declare public languages: ManyToMany<typeof Language>

  @column()
  declare public pegi_rating: 'PEGI 3' | 'PEGI 7' | 'PEGI 12' | 'PEGI 16' | 'PEGI 18'

  @hasMany(() => GameMedia, {
    foreignKey: 'games_id',
  })
  declare public gameMedias: HasMany<typeof GameMedia>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime | null

  /**
   * Surcharge de la sérialisation pour convertir les champs en booléens explicites
   * lors de la sérialisation en JSON de la response
   * @returns {ModelObject} - L'objet sérialisé avec les champs booléens
   */
  public serialize(): ModelObject {
    const serialized: ModelObject = super.serialize()

    return {
      ...serialized,
      upcoming_game: serialized.upcoming_game === null ? null : !!serialized.upcoming_game,
      new_game: serialized.new_game === null ? null : !!serialized.new_game,
    } as ModelObject
  }
}
