import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import GamePlatform from 'App/Models/GamePlatform'
import Game from 'App/Models/Game'
import Bucket from 'App/Models/Bucket'
import File from 'App/Models/File'

export default class GameBinary extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public game_platforms_id: number

  @belongsTo(() => GamePlatform, {
    foreignKey: 'game_platforms_id',
  })
  public gamePlatform: BelongsTo<typeof GamePlatform>

  @manyToMany(() => Game, {
    pivotTable: 'game_binary_assignments',
  })
  public game: ManyToMany<typeof Game>

  @column()
  public files_id: number

  @belongsTo(() => File, {
    foreignKey: 'files_id',
  })
  public file: BelongsTo<typeof File>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
