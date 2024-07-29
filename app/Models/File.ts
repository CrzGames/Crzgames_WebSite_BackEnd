import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Bucket from 'App/Models/Bucket'
import Env from '@ioc:Adonis/Core/Env'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pathfilename: string

  @column()
  public get url(): string {
    return this.getUrl(this.$attributes.url)
  }

  public getUrl(url: string): string {
    let endpoint: string = Env.get('S3_ENDPOINT') as string

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
  public buckets_id: number

  @column()
  public size: number // in bytes

  @belongsTo(() => Bucket, {
    foreignKey: 'buckets_id',
  })
  public bucket: BelongsTo<typeof Bucket>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
