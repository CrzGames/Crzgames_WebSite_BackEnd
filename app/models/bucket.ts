import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import File from '#models/file'
import type { HasMany } from '@adonisjs/lucid/types/relations'

/**
 * Represents a storage bucket in the system.
 * Each bucket can contain multiple files and has a visibility setting.
 */
export default class Bucket extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public name: string

  @column()
  declare public visibility: string

  @hasMany(() => File)
  declare public file: HasMany<typeof File>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
