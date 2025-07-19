import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import File from '#models/file'
import type { HasMany } from '@adonisjs/lucid/types/relations'

/**
 * Représente un bucket de stockage.
 * Un bucket est un conteneur pour stocker des fichiers.
 * Il peut être public ou privé, et contient des fichiers associés.
 * @class Bucket
 * @property {number} id - L'identifiant unique du bucket.
 * @property {string} name - Le nom du bucket.
 * @property {string} visibility - La visibilité du bucket (public ou privé).
 * @property {File[]} file - Les fichiers associés au bucket.
 * @property {DateTime} createdAt - La date de création du bucket.
 * @property {DateTime} updatedAt - La date de la dernière mise à jour du bucket.
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
