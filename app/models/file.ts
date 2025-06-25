import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Bucket from '#models/bucket'
import env from '#start/env'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public pathfilename: string

  @column()
  public get url(): string {
    return this.getUrl(this.$attributes.url)
  }

  public getUrl(url: string): string {
    let endpoint: string = env.get('S3_ENDPOINT') as string

    // Si 'host.docker.internal' est dans l'endpoint, remplacez-le par 'localhost'
    if (endpoint.includes('host.docker.internal')) {
      endpoint = endpoint.replace('host.docker.internal', 'localhost')
    }

    // Assurez-vous que la relation bucket est chargée
    if (!this.bucket) {
      throw new Error('Bucket relation not loaded for File model')
    }

    return `${endpoint}/${this.bucket.name}/${url}`
  }

  @column()
  declare public buckets_id: number

  @column()
  declare public size: number // in bytes

  @belongsTo(() => Bucket, {
    foreignKey: 'buckets_id',
  })
  declare public bucket: BelongsTo<typeof Bucket>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
