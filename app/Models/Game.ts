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
} from '@ioc:Adonis/Lucid/Orm'
import File from 'App/Models/File'
import GameCategory from 'App/Models/GameCategory'
import GamePlatform from 'App/Models/GamePlatform'
import GameBinary from 'App/Models/GameBinary'
import GameVersion from 'App/Models/GameVersion'

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
