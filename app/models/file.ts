import { belongsTo } from '@adonisjs/lucid/orm'
import Bucket from '#models/bucket'

import env from '#start/env'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { ModelObject } from '@adonisjs/lucid/types/model'

import { FileSchema } from '#database/schema'

export default class File extends FileSchema {
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

  /**
   * Conserve le comportement historique:
   * exposer `url` déjà résolu dans la réponse JSON.
   */
  public serialize(): ModelObject {
    const serialized: ModelObject = super.serialize()

    return {
      ...serialized,
      url: this.getUrl(this.$attributes.url),
    } as ModelObject
  }

  @belongsTo(() => Bucket, {
    foreignKey: 'bucketsId',
  })
  declare public bucket: BelongsTo<typeof Bucket>
}

