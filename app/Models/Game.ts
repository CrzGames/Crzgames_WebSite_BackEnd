import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  HasMany,
  hasMany,
  manyToMany,
  ManyToMany,
  ModelObject,
} from '@ioc:Adonis/Lucid/Orm'
import File from 'App/Models/File'
import GameCategory from 'App/Models/GameCategory'
import GamePlatform from 'App/Models/GamePlatform'
import GameBinary from 'App/Models/GameBinary'
import GameVersion from 'App/Models/GameVersion'
import Language from 'App/Models/Language'
import GameConfiguration from './GameConfiguration'

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @hasMany(() => GameVersion, {
    foreignKey: 'games_id',
  })
  public gameVersions: HasMany<typeof GameVersion>

  @manyToMany(() => GamePlatform, {
    pivotTable: 'game_platform_assignments',
    pivotForeignKey: 'games_id',
    pivotRelatedForeignKey: 'game_platforms_id',
  })
  public gamePlatform: ManyToMany<typeof GamePlatform>

  @manyToMany(() => GameBinary, {
    pivotTable: 'game_binary_assignments',
    pivotForeignKey: 'games_id',
    pivotRelatedForeignKey: 'game_binaries_id',
  })
  public gameBinary: ManyToMany<typeof GameBinary>

  @manyToMany(() => GameCategory, {
    pivotTable: 'game_category_assignments',
    pivotForeignKey: 'games_id',
    pivotRelatedForeignKey: 'game_categories_id',
  })
  public gameCategory: ManyToMany<typeof GameCategory>

  @column()
  public trailer_files_id: number

  @belongsTo(() => File, {
    foreignKey: 'trailer_files_id',
  })
  public trailerFile: BelongsTo<typeof File>

  @column()
  public picture_files_id: number

  @belongsTo(() => File, {
    foreignKey: 'picture_files_id',
  })
  public pictureFile: BelongsTo<typeof File>

  @column()
  public logo_files_id: number

  @belongsTo(() => File, {
    foreignKey: 'logo_files_id',
  })
  public logoFile: BelongsTo<typeof File>

  @column()
  public description: string

  @column()
  public upcoming_game: boolean | null

  @column()
  public new_game: boolean | null

  @column.dateTime()
  public release_date: DateTime | null

  @column()
  public game_mode: 'solo' | 'multiplayer' | 'both'

  @column()
  public publisher: string

  @column()
  public developer: string

  @column()
  public game_configurations_minimal_id: number | null

  @belongsTo(() => GameConfiguration, { foreignKey: 'game_configurations_minimal_id' })
  public gameConfigurationMinimal: BelongsTo<typeof GameConfiguration>

  @column()
  public game_configurations_recommended_id: number | null

  @belongsTo(() => GameConfiguration, { foreignKey: 'game_configurations_recommended_id' })
  public gameConfigurationRecommended: BelongsTo<typeof GameConfiguration>

  @manyToMany(() => Language, {
    pivotTable: 'game_languages',
    pivotForeignKey: 'games_id',
    pivotRelatedForeignKey: 'languages_id',
  })
  public languages: ManyToMany<typeof Language>

  @column()
  public pegi_rating: 'PEGI 3' | 'PEGI 7' | 'PEGI 12' | 'PEGI 16' | 'PEGI 18'
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime | null

  /**
   * Surcharge de la sérialisation pour convertir les champs en booléens explicites
   * lors de la sérialisation en JSON de la response
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
