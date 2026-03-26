import { afterFetch, afterFind, belongsTo } from '@adonisjs/lucid/orm'
import Bucket from '#models/bucket'

import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { ModelObject } from '@adonisjs/lucid/types/model'

import { FileSchema } from '#database/schema'

const PRIVATE_URL_MIN_EXPIRATION_SECONDS: number = 60
const PRIVATE_URL_MAX_EXPIRATION_SECONDS: number = 60 * 60 * 24 * 7
const PRIVATE_URL_DEFAULT_EXPIRATION_SECONDS: number = 60 * 60

const s3ClientForFileModel: S3Client = new S3Client({
  credentials: {
    accessKeyId: env.get('S3_BUCKET_ACCESS_KEY_ID'),
    secretAccessKey: env.get('S3_BUCKET_SECRET_ACCESS_KEY'),
  },
  region: env.get('S3_BUCKET_REGION'),
  endpoint: env.get('S3_BUCKET_ENDPOINT'),
  forcePathStyle: env.get('S3_BUCKET_FORCE_PATH_STYLE'),
})

export default class File extends FileSchema {
  private static normalizePrivateUrlExpiration(expiresIn: number): number {
    return Math.max(PRIVATE_URL_MIN_EXPIRATION_SECONDS, Math.min(expiresIn, PRIVATE_URL_MAX_EXPIRATION_SECONDS))
  }

  private static replaceHostInUrl(url: string): string {
    return url.replace('host.docker.internal', 'localhost')
  }

  private static async resolveFileUrl(file: File): Promise<void> {
    try {
      if (!file.$preloaded.bucket) {
        await file.load('bucket')
      }

      if (!file.bucket || !file.$attributes.url) {
        return
      }

      if (file.bucket.visibility === 'private') {
        const command: GetObjectCommand = new GetObjectCommand({
          Bucket: file.bucket.name,
          Key: file.$attributes.url,
        })

        const signedUrl: string = await getSignedUrl(s3ClientForFileModel, command, {
          expiresIn: this.normalizePrivateUrlExpiration(PRIVATE_URL_DEFAULT_EXPIRATION_SECONDS),
        })

        file.$extras.resolvedUrl = this.replaceHostInUrl(signedUrl)
        return
      }

      file.$extras.resolvedUrl = file.getUrl(file.$attributes.url)
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Unknown error'
      logger.warn(`File.resolveFileUrl fallback to direct url: ${errorMessage}`)
      file.$extras.resolvedUrl = file.getUrl(file.$attributes.url)
    }
  }

  @afterFind()
  public static async onAfterFind(file: File): Promise<void> {
    await this.resolveFileUrl(file)
  }

  @afterFetch()
  public static async onAfterFetch(files: File[]): Promise<void> {
    await Promise.all(files.map((file: File): Promise<void> => this.resolveFileUrl(file)))
  }

  public getUrl(url: string): string {
    let endpoint: string = env.get('S3_BUCKET_ENDPOINT')

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
      url: (this.$extras.resolvedUrl as string | undefined) ?? this.getUrl(this.$attributes.url),
    } as ModelObject
  }

  @belongsTo(() => Bucket, {
    foreignKey: 'bucketsId',
  })
  declare public bucket: BelongsTo<typeof Bucket>
}
