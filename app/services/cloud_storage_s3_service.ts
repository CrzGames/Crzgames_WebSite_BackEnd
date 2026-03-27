import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  GetBucketAclCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type {
  DeleteBucketCommandOutput,
  CreateBucketCommandOutput,
  GetObjectCommandOutput,
  ListObjectsV2CommandOutput,
  GetBucketAclCommandOutput,
  Grant,
  _Object,
  CreateBucketCommandInput,
  GetObjectCommandInput,
  ListObjectsV2CommandInput,
  DeleteObjectsCommandInput,
} from '@aws-sdk/client-s3'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'
import drive from '@adonisjs/drive/services/main'
import MyBucket from '#models/bucket'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import File from '#models/file'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import fs from 'fs'
import { promisify } from 'util'
import type { Buffer } from 'buffer'
import { DateTime } from 'luxon'
import archiver from 'archiver'
import type { HttpContext } from '@adonisjs/core/http'
import type { ObjectMetaData } from '@adonisjs/drive/types'
import type { Readable } from 'stream'
import { errors as lucidErrors } from '@adonisjs/lucid'
import type { RelationSubQueryBuilderContract } from '@adonisjs/lucid/types/relations'

const readFile: any = promisify(fs.readFile)
const PRESIGNED_URL_MIN_EXPIRATION_SECONDS: number = 60
const PRESIGNED_URL_MAX_EXPIRATION_SECONDS: number = 60 * 60 * 24 * 7
const PRESIGNED_URL_DEFAULT_EXPIRATION_SECONDS: number = 900

/**
 * Documentation Client S3 AWS v3 for Node.js : https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/
 */
const s3Client: S3Client = new S3Client({
  credentials: {
    accessKeyId: env.get('S3_BUCKET_ACCESS_KEY_ID'),
    secretAccessKey: env.get('S3_BUCKET_SECRET_ACCESS_KEY'),
  },
  region: env.get('S3_BUCKET_REGION'),
  endpoint: env.get('S3_BUCKET_ENDPOINT'),
  forcePathStyle: env.get('S3_BUCKET_FORCE_PATH_STYLE'),
})

/**
 * Commande pour les opérations sur les fichiers dans le bucket
 * @typedef {object} BucketFileCommand
 * @property {string} pathFilename - Le chemin et le nom du fichier dans le bucket
 * @property {string} bucketName - Le nom du bucket S3
 * @property {MultipartFile} [file] - Le fichier à uploader (pour les assets réel, donc sans seeders)
 * @property {MultipartFile[]} [files] - Liste de fichiers à uploader (pour les assets réel, donc sans seeders)
 * @property {string} [localPath] - Chemin local des assets pour les seeders (pour develop et tests)
 */
export type BucketFileCommand = {
  pathFilename: string
  bucketName: string
  // 'File' pour les assets réel et 'localPath' pour les assets local pour les seeders (pour develop)
  file?: MultipartFile
  files?: MultipartFile[]
  localPath?: string
}

/**
 * Représente un bucket dans la base de données
 * @typedef {object} MyBucket
 * @property {number} id - L'ID du bucket
 * @property {string} name - Le nom du bucket
 * @property {string} visibility - La visibilité du bucket (public ou private)
 * @property {DateTime} createdAt - La date de création du bucket
 * @property {DateTime} updatedAt - La date de mise à jour du bucket
 * @property {number} totalObjects - Le nombre total d'objets dans le bucket
 * @property {number} totalSize - La taille totale des objets dans le bucket
 * @property {Grant[]} access - Les permissions d'accès au bucket
 */
export type ExtendedBucket = {
  id?: number
  name: string
  visibility?: string
  createdAt?: DateTime
  updatedAt?: DateTime
  totalObjects?: number
  totalSize?: number
  access?: Grant[]
}

/**
 * Représente un fichier étendu dans le bucket
 * @typedef {object} ExtendedFile
 * @property {string} Key - La clé du fichier dans le bucket
 * @property {DateTime} [LastModified] - La date de dernière modification du fichier
 * @property {number} [Size] - La taille du fichier en octets
 */
export type ExtendedFile = {
  Key: string
  LastModified?: DateTime
  Size?: number
}

/**
 * ReprÃ©sente une URL pre-signee associee a un chemin de fichier
 * @typedef {object} LauncherPresignedUrlEntry
 * @property {string} pathFilename - Le chemin complet du fichier dans le bucket
 * @property {string} url - L'URL pre-signee
 */
export type LauncherPresignedUrlEntry = {
  pathFilename: string
  url: string
}

/**
 * Service pour gérer les opérations de stockage dans un bucket S3
 */
export default class CloudStorageS3Service {
  /**
   * Récupère un bucket S3 par son nom
   * @param {string} bucketName - Le nom du bucket S3
   * @returns {Promise<ExtendedBucket[]>} - Liste des buckets S3
   */
  public static async getBucketByName(bucketName: string): Promise<MyBucket> {
    try {
      return await MyBucket.query().where('name', bucketName).firstOrFail()
    } catch (error: any) {
      logger.error('Error fetching bucket by name: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Get bucket by name: Bucket ${bucketName} not found`)
      }

      throw new InternalServerErrorException(`Get bucket by name: Error fetching bucket ${bucketName}`)
    }
  }

  /**
   * Récupère le contenu d'un fichier dans un bucket S3
   * @param {string} bucketName - Le nom du bucket S3
   * @param {string} pathFilename - Le chemin et le nom du fichier dans le bucket
   * @returns {Promise<string>} - Le contenu du fichier
   */
  public static async getFileContent(bucketName: string, pathFilename: string): Promise<string> {
    try {
      // Vérifier si le fichier existe dans le bucket
      const command: GetObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: pathFilename,
      })
      const response: GetObjectCommandOutput = await s3Client.send(command)

      // Vérifier si le corps de la réponse est défini et renvoie le contenu du fichier
      if (!response.Body) {
        throw new InternalServerErrorException('Error while fetching file content')
      } else {
        return await response.Body.transformToString('utf-8')
      }
    } catch (error: any) {
      logger.error('Error fetching file content: ' + error.message)

      if (error instanceof InternalServerErrorException) {
        throw error
      }

      throw new InternalServerErrorException('Error while fetching file content')
    }
  }

  /**
   * Remplace 'host.docker.internal' par 'localhost' dans une URL pour les environnements de développement
   * @param {string} url - L'URL à modifier
   * @returns {string} - L'URL modifiée
   */
  private static replaceHostInUrl(url: string): string {
    return url.replace('host.docker.internal', 'localhost')
  }

  /**
   * Upload un fichier ou un dossier dans un bucket S3
   * @param {BucketFileCommand} bucketFile - Commande contenant les informations du fichier ou du dossier à uploader
   * @returns {Promise<void>}
   */
  public static async uploadFileOrFolderInBucket(bucketFile: BucketFileCommand): Promise<void> {
    if (bucketFile.files) {
      // Pour plusieurs fichiers, que pour les assets réel en production
      for (const file of bucketFile.files) {
        if (file.state === 'consumed' && file.tmpPath) {
          const fileContentBuffer: Buffer = await readFile(file.tmpPath)
          const filePath: string = `${bucketFile.pathFilename}/${file.clientName}`
          console.log('uploadFileOrFolderInBucket : ' + filePath)
          await drive.use().put(filePath, fileContentBuffer)
        }
      }
    } else {
      // Pour un seul fichier, que ce sois pour les seeders ou les assets réel en production
      let fileContentBuffer: any = null
      if (bucketFile.localPath) {
        fileContentBuffer = await readFile(bucketFile.localPath)
      } else if (bucketFile.file?.state === 'consumed' && bucketFile.file.tmpPath) {
        fileContentBuffer = await readFile(bucketFile.file.tmpPath)
      }
      console.log('Uploading to path:', bucketFile.pathFilename)
      await drive.use().put(bucketFile.pathFilename, fileContentBuffer)
    }
  }

  /**
   * Crée un fichier dans la base de données et le bucket S3
   * @param {BucketFileCommand} bucketFile - Commande contenant les informations du fichier à créer
   * @returns {Promise<File>} - Le fichier créé dans la base de données
   */
  public static async createFileInDB(bucketFile: BucketFileCommand): Promise<File> {
    // Vérifier si le fichier existe déjà dans la DB, si oui, le retourner sinon le créer
    const fileInstance: File | null = await this.getFileWithPathFileNameAndBucketName(bucketFile)
    if (fileInstance) {
      return fileInstance
    }

    // Chercher le bucket en question dans la db pour récupérer la visibilité du bucket
    const bucket: MyBucket = await this.getBucketByName(bucketFile.bucketName)

    // Chercher le bucket s3 pour connaître la Size à partir du pathfilename via le bucket S3
    const params: ListObjectsV2CommandInput = {
      Bucket: bucket.name,
      Prefix: bucketFile.pathFilename,
    }

    let totalSize: number = 0
    let continuationToken: string | undefined

    do {
      try {
        const listObjects: ListObjectsV2Command = new ListObjectsV2Command({
          ...params,
          ContinuationToken: continuationToken,
        })

        const data: ListObjectsV2CommandOutput = await s3Client.send(listObjects)

        if (data.Contents) {
          data.Contents.forEach((obj: _Object): void => {
            if (obj.Key && obj.Size) {
              totalSize += obj.Size // Additionner les tailles des objets listés
            }
          })
        }

        continuationToken = data.NextContinuationToken
      } catch (error) {
        throw new Error(`Error in listing objects: ${error.message}`)
      }
    } while (continuationToken)

    // Enregistrer le fichier dans une base de données
    const file: File = await File.create({
      bucketsId: bucket.id,
      pathfilename: bucketFile.pathFilename,
      url: bucketFile.pathFilename,
      size: totalSize,
    })

    // Charger (manuellement) la relation "bucket" pour éviter l'erreur dans le getter "url"
    file.$setRelated('bucket', bucket)

    // Retourner le fichier créé
    return file
  }

  /**
   * Met à jour un fichier dans la base de données et le bucket S3
   * @param {BucketFileCommand} bucketFile - Commande contenant les informations du fichier à mettre à jour
   * @param {number} id - L'ID du fichier à mettre à jour
   * @returns {Promise<void>}
   */
  public static async updateFileInDB(bucketFile: BucketFileCommand, id: number): Promise<void> {
    // Chercher le bucket en question dans la db pour récupérer la visibilité du bucket
    const bucket: MyBucket = await this.getBucketByName(bucketFile.bucketName)

    // Chercher le bucket s3 pour connaître la Size à partir du pathfilename via le bucket S3
    const params: ListObjectsV2CommandInput = {
      Bucket: bucket.name,
      Prefix: bucketFile.pathFilename,
    }

    let totalSize: number = 0
    let continuationToken: string | undefined

    do {
      try {
        const listObjects: ListObjectsV2Command = new ListObjectsV2Command({
          ...params,
          ContinuationToken: continuationToken,
        })

        const data: ListObjectsV2CommandOutput = await s3Client.send(listObjects)

        if (data.Contents) {
          data.Contents.forEach((obj: _Object): void => {
            if (obj.Key && obj.Size) {
              totalSize += obj.Size // Additionner les tailles des objets listés
            }
          })
        }

        continuationToken = data.NextContinuationToken
      } catch (error) {
        throw new Error(`Error in listing objects: ${error.message}`)
      }
    } while (continuationToken)

    // Mettre à jour le fichier dans la base de données
    const file: File = await File.query().preload('bucket').where('id', id).firstOrFail()
    await file
      .merge({
        bucketsId: bucket.id,
        pathfilename: bucketFile.pathFilename,
        url: bucketFile.pathFilename,
        size: totalSize,
      })
      .save()
  }

  /**
   * Supprime un dossier dans le bucket S3 et la base de données
   * @param {string} bucketName - Le nom du bucket S3
   * @param {string} folderPath - Le chemin du dossier à supprimer
   * @returns {Promise<void>}
   */
  private static async deleteFolderInBucketAndDB(bucketName: string, folderPath: string): Promise<void> {
    try {
      const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: folderPath,
      })

      const listedObjects: ListObjectsV2CommandOutput = await s3Client.send(listCommand)

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) return

      // Check si les fichiers/dossier est utilisé en base de donnée si c'est le cas le supprime
      for (const item of listedObjects.Contents) {
        if (item.Key) {
          const fileOrFolder: File | null = await File.query().preload('bucket').where('pathfilename', item.Key).first()

          if (fileOrFolder) {
            await fileOrFolder.delete()
          }
        }
      }

      const deleteParams: DeleteObjectsCommandInput = {
        Bucket: bucketName,
        Delete: {
          Objects: listedObjects.Contents.filter((item: _Object): item is _Object & { Key: string } =>
            Boolean(item.Key),
          ).map((item: _Object & { Key: string }): { Key: string } => ({ Key: item.Key })),
        },
      }

      const deleteCommand: DeleteObjectsCommand = new DeleteObjectsCommand(deleteParams)
      await s3Client.send(deleteCommand)

      if (listedObjects.IsTruncated) await this.deleteFolderInBucketAndDB(bucketName, folderPath)
    } catch (error) {
      logger.error(`Error deleteFolderInBucket: ${error.message}`)
      throw new Error(`Error deleteFolderInBucket: ${error.message}`)
    }
  }

  /**
   * Supprime un fichier dans le bucket S3 et la base de données
   * @param {string} pathFilename - Le chemin et le nom du fichier à supprimer
   * @returns {Promise<void>}
   */
  private static async deleteFileInBucketAndDB(pathFilename: string): Promise<void> {
    try {
      if (await drive.use().exists(pathFilename)) {
        await drive.use().delete(pathFilename)

        // Check si le fichier est utilisé en base de donnée si c'est le cas le supprime
        const file: File | null = await File.query().preload('bucket').where('pathfilename', pathFilename).first()

        if (file !== null) {
          await file.delete()
        }

        logger.info('deleteFileInBucketAndDB delete file success')
      } else {
        logger.warn('deleteFileInBucketAndDB pathfilename no exist for file')
      }
    } catch (error) {
      logger.error(`Error deleteFileInBucketAndDB: ${error.message}`)
      throw new Error(`Error deleteFileInBucketAndDB: ${error.message}`)
    }
  }

  /**
   * Supprime un fichier ou un dossier dans le bucket S3 et la base de données
   * @param {string} pathFilename - Le chemin et le nom du fichier ou du dossier à supprimer
   * @param {string} bucketName - Le nom du bucket S3
   * @returns {Promise<void>}
   */
  public static async deleteInBucketAndDB(pathFilename: string, bucketName: string): Promise<void> {
    try {
      // Si c'est une demande de suppression d'un dossier
      if (pathFilename.endsWith('/')) {
        await this.deleteFolderInBucketAndDB(bucketName, pathFilename)
      } else {
        // Si c'est une demande de suppression d'un fichier
        await this.deleteFileInBucketAndDB(pathFilename)
      }
    } catch (error) {
      logger.error(`Error deleteInBucketAndDB: ${error.message}`)
      throw new Error(`Error deleteInBucketAndDB: ${error.message}`)
    }
  }

  /**
   * Récupère un fichier dans le bucket S3 et retourne son URL
   * @param {string} pathFilename - Le chemin et le nom du fichier dans le bucket
   * @returns {Promise<string | undefined>} - L'URL du fichier ou undefined si le fichier n'existe pas
   */
  public static async getURLToFileInBucket(pathFilename: string): Promise<string | undefined> {
    try {
      const file: File | null = await File.query().preload('bucket').where('pathfilename', pathFilename).first()

      if (!file) {
        logger.warn(`getFileInBucket pathfilename not found in database: ${pathFilename}`)
        return undefined
      }

      const normalizedExpiresIn: number = Math.max(
        PRESIGNED_URL_MIN_EXPIRATION_SECONDS,
        Math.min(PRESIGNED_URL_DEFAULT_EXPIRATION_SECONDS, PRESIGNED_URL_MAX_EXPIRATION_SECONDS),
      )

      if (file.bucket.visibility === 'private') {
        const command: GetObjectCommand = new GetObjectCommand({
          Bucket: file.bucket.name,
          Key: pathFilename,
        })
        const signedUrl: string = await getSignedUrl(s3Client, command, { expiresIn: normalizedExpiresIn })

        if (env.get('NODE_ENV') === 'development' || env.get('NODE_ENV') === 'test') {
          return this.replaceHostInUrl(signedUrl)
        }

        return signedUrl
      }

      if (await drive.use().exists(pathFilename)) {
        logger.info('getFileInBucket success pathfilename for file')
        const fileUrl: string = await drive.use().getUrl(pathFilename)

        // En développement, on remplace 'host.docker.internal' par 'localhost' pour les URLs
        if (env.get('NODE_ENV') === 'development' || env.get('NODE_ENV') === 'test') {
          return this.replaceHostInUrl(fileUrl)
        }

        return fileUrl
      }

      logger.warn(`getFileInBucket pathfilename no exist for file: ${pathFilename}`)
      return undefined
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Unknown error'
      logger.error(`Error getFileInBucket: ${errorMessage}`)
      throw new Error(`Error getFileInBucket: ${errorMessage}`)
    }
  }

  /**
   * Récupère le système d'exploitation à partir de l'agent utilisateur
   * @param {string} userAgent - L'agent utilisateur du navigateur
   * @returns {string} - Le nom du système d'exploitation
   */
  public static getOperatingSystem(userAgent: string): string {
    if (userAgent.includes('Win')) return 'Windows'
    if (userAgent.includes('Mac')) return 'MacOS'
    if (userAgent.includes('X11')) return 'UNIX'
    if (userAgent.includes('Linux')) return 'Linux'
    return 'Unknown'
  }

  /**
   * Récupère tous les objets d'un bucket S3 avec un préfixe donné
   * @param {string} bucketName - Le nom du bucket S3
   * @param {string} prefix - Le préfixe des objets à lister
   * @returns {Promise<_Object[]>} - Liste des objets dans le bucket
   */
  private static async fetchAllObjects(bucketName: string, prefix: string): Promise<_Object[]> {
    let continuationToken: string | undefined = undefined
    let contents: _Object[] = []

    do {
      const listParams: ListObjectsV2CommandInput = {
        Bucket: bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }
      const response: ListObjectsV2CommandOutput = await s3Client.send(new ListObjectsV2Command(listParams))
      contents = contents.concat(response.Contents || [])
      continuationToken = response.NextContinuationToken
    } while (continuationToken)

    return contents
  }

  /**
   * Télécharge un fichier ou un dossier dans le bucket S3 et le stream pour le launcher
   * @param {HttpContext} ctx - Le contexte HTTP
   * @param {string} pathFilename - Le chemin et le nom du fichier ou du dossier à télécharger
   * @param {string} bucketName - Le nom du bucket S3
   * @returns {Promise<void>}
   */
  public static async streamDownloadFileOrFolderInBucketForLauncher(
    ctx: HttpContext,
    pathFilename: string,
    bucketName: string,
  ): Promise<void> {
    logger.info(`Début du téléchargement pour le chemin : ${pathFilename} dans le bucket : ${bucketName}`)

    try {
      // Vérifier si le chemin est une application macOS (.app)
      if (pathFilename.endsWith('.app')) {
        // Utilisation directe de l'objet response natif de Node.js pour CORS ou autres en-têtes critiques
        const zipFilename: string = `${pathFilename.split('/').pop()}.zip`

        ctx.response.response.setHeader('Content-Type', 'application/zip')
        ctx.response.response.setHeader('Access-Control-Allow-Origin', '*')
        ctx.response.response.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`)
        ctx.response.response.setHeader('Transfer-Encoding', 'chunked')

        // Créer l'archive et définir le type à zip
        const archive: archiver.Archiver = archiver('zip')

        // Commencer le streaming des données
        archive.pipe(ctx.response.response) // Envoi direct au client

        const contents: _Object[] = await this.fetchAllObjects(bucketName, pathFilename)

        if (contents.length > 0) {
          for (const item of contents) {
            if (
              item.Key &&
              !item.Key.endsWith('.tar.gz') &&
              !item.Key.endsWith('.zip') &&
              !item.Key.endsWith('.tar.gz.sig')
            ) {
              const relativePath: string = item.Key.substring(pathFilename.length + 1) // Relative path inside the zip
              const objectStream: Readable = await this.getObjectStream(bucketName, item.Key)
              // @ts-ignore
              archive.append(objectStream, { name: relativePath })
            }
          }
        }

        // Finaliser l'archive après l'ajout de tous les fichiers
        await archive.finalize()
        archive.on('finish', (): void => {
          console.log('Archive finalisée et prête à être téléchargée.')
        })

        return
      }

      // Vérifier si le chemin existe
      if (await drive.use().exists(pathFilename)) {
        const meta: ObjectMetaData = await drive.use().getMetaData(pathFilename)

        // On considère que si on a des métadonnées, c'est un fichier
        const fileStream: Readable = await drive.use().getStream(pathFilename)

        ctx.response.response.setHeader('Content-Type', 'application/octet-stream')
        ctx.response.response.setHeader(
          'Content-Disposition',
          `attachment; filename="${pathFilename.split('/').pop()}"`,
        )
        ctx.response.response.setHeader('Content-Length', meta.contentLength.toString())

        return ctx.response.stream(fileStream)
      }

      throw new NotFoundException('File or folder not found')
    } catch (error) {
      logger.error('Erreur lors de la vérification du chemin ou de la génération du fichier :', error)
      throw new NotFoundException('File or folder not found')
    }
  }

  /**
   * Génère une URL pré-signée de téléchargement pour le launcher.
   * Cette méthode évite de proxifier le flux binaire via l'API backend.
   * @param {string} bucketName - Nom du bucket S3
   * @param {string} pathFilename - Chemin complet de l'objet dans S3
   * @param {number} [expiresIn=900] - Durée de validité de l'URL en secondes
   * @returns {Promise<string>} - URL pré-signée
   */
  public static async getPresignedDownloadUrlForLauncher(
    bucketName: string,
    pathFilename: string,
    expiresIn: number = PRESIGNED_URL_DEFAULT_EXPIRATION_SECONDS,
  ): Promise<string> {
    const normalizedExpiresIn: number = Math.max(
      PRESIGNED_URL_MIN_EXPIRATION_SECONDS,
      Math.min(expiresIn, PRESIGNED_URL_MAX_EXPIRATION_SECONDS),
    )

    if (!(await drive.use().exists(pathFilename))) {
      throw new NotFoundException(`File not found for presign: ${pathFilename}`)
    }

    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: pathFilename,
    })

    return await getSignedUrl(s3Client, command, { expiresIn: normalizedExpiresIn })
  }

  /**
   * GÃ©nÃ¨re des URLs prÃ©-signÃ©es de tÃ©lÃ©chargement pour le launcher en lot.
   * Cette mÃ©thode rÃ©duit le nombre d'aller-retours HTTP entre launcher et backend.
   * @param {string} bucketName - Nom du bucket S3
   * @param {string[]} pathFilenames - Liste des chemins complets des objets dans S3
   * @param {number} [expiresIn=900] - DurÃ©e de validitÃ© des URLs en secondes
   * @returns {Promise<LauncherPresignedUrlEntry[]>} - Liste des URLs prÃ©-signÃ©es par fichier
   */
  public static async getPresignedDownloadUrlsForLauncher(
    bucketName: string,
    pathFilenames: string[],
    expiresIn: number = PRESIGNED_URL_DEFAULT_EXPIRATION_SECONDS,
  ): Promise<LauncherPresignedUrlEntry[]> {
    const normalizedExpiresIn: number = Math.max(
      PRESIGNED_URL_MIN_EXPIRATION_SECONDS,
      Math.min(expiresIn, PRESIGNED_URL_MAX_EXPIRATION_SECONDS),
    )

    const sanitizedPathFilenames: string[] = [
      ...new Set(
        pathFilenames
          .map((pathFilename: string): string => pathFilename.trim())
          .filter((pathFilename: string): boolean => pathFilename.length > 0),
      ),
    ]

    if (sanitizedPathFilenames.length === 0) {
      return []
    }

    return await Promise.all(
      sanitizedPathFilenames.map(async (pathFilename: string): Promise<LauncherPresignedUrlEntry> => {
        const command: GetObjectCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: pathFilename,
        })

        const signedUrl: string = await getSignedUrl(s3Client, command, { expiresIn: normalizedExpiresIn })

        return {
          pathFilename: pathFilename,
          url: signedUrl,
        }
      }),
    )
  }

  /**
   * Méthode pour obtenir un flux d'objet depuis S3
   * @param {string} bucketName - Le nom du bucket S3
   * @param {string} key - La clé de l'objet S3
   * @returns {Promise<Readable>} - Un flux lisible de l
   */
  private static async getObjectStream(bucketName: string, key: string): Promise<Readable> {
    const getObjectParams: GetObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
    }
    const command: GetObjectCommand = new GetObjectCommand(getObjectParams)
    const { Body } = await s3Client.send(command)
    return Body as Readable
  }

  /**
   * Télécharge un fichier ou un dossier dans le bucket S3 et le stream pour le client
   * @param {HttpContext} ctx - Le contexte HTTP
   * @param {string} pathFilename - Le chemin et le nom du fichier ou du dossier à télécharger
   * @param {string} bucketName - Le nom du bucket S3
   * @returns {Promise<void>}
   */
  public static async streamDownloadFileOrFolderInBucket(
    ctx: HttpContext,
    pathFilename: string,
    bucketName: string,
  ): Promise<void> {
    logger.info(`Début du téléchargement pour le chemin : ${pathFilename} dans le bucket : ${bucketName}`)

    // Vérifier si le chemin se termine par '.zip' (donc pas besoin d'archiver)
    if (pathFilename.endsWith('.zip')) {
      logger.info('Téléchargement direct d un fichier ZIP détecté')

      if (await drive.use().exists(pathFilename)) {
        const fileStream: Readable = await drive.use().getStream(pathFilename)
        const { contentLength } = await drive.use().getMetaData(pathFilename)

        ctx.response.response.setHeader('Content-Type', 'application/zip')
        ctx.response.response.setHeader(
          'Content-Disposition',
          `attachment; filename="${pathFilename.split('/').pop()}"`,
        )
        ctx.response.response.setHeader('Content-Length', contentLength.toString())

        return ctx.response.stream(fileStream)
      }

      throw new NotFoundException('Fichier ZIP non trouvé')
    }

    // Pour le launcher (et tout client), si pathFilename cible un fichier,
    // on stream le binaire directement sans compression à la volée.
    if (!pathFilename.endsWith('/')) {
      logger.info(`Téléchargement direct d un fichier détecté: ${pathFilename}`)

      if (await drive.use().exists(pathFilename)) {
        const fileStream: Readable = await drive.use().getStream(pathFilename)
        const { contentLength } = await drive.use().getMetaData(pathFilename)

        ctx.response.response.setHeader('Content-Type', 'application/octet-stream')
        ctx.response.response.setHeader(
          'Content-Disposition',
          `attachment; filename="${pathFilename.split('/').pop()}"`,
        )
        ctx.response.response.setHeader('Content-Length', contentLength.toString())

        return ctx.response.stream(fileStream)
      }

      throw new NotFoundException('Fichier non trouvé')
    }

    // Utilisation directe de l'objet response natif de Node.js pour CORS ou autres en-têtes critiques
    ctx.response.response.setHeader('Content-Type', 'application/zip')
    ctx.response.response.setHeader('Access-Control-Allow-Origin', '*')
    ctx.response.response.setHeader('Content-Disposition', 'attachment; filename="archive.zip"')
    ctx.response.response.setHeader('Transfer-Encoding', 'chunked')

    // Create archive and set the type to zip
    const archiveType: archiver.Format = 'zip'
    const archive: archiver.Archiver = archiver(archiveType)

    // Commencer le streaming des données
    archive.pipe(ctx.response.response) // Envoi direct au client

    const contents: _Object[] = await this.fetchAllObjects(bucketName, pathFilename)

    if (contents.length > 0) {
      const fetchPromises: (Promise<void> | undefined)[] = contents.map((item: _Object) => {
        if (item.Key) {
          return this.fetchAndAppendFile(item.Key, archive, pathFilename, bucketName)
        }
      })

      // Attendez que tous les fichiers soient ajoutés
      await Promise.all(fetchPromises)
    }

    // Finalisation de l'archive après l'ajout de tous les fichiers
    await archive.finalize()
    archive.on('finish', (): void => {
      console.log('Archive finalisée et prête à être téléchargée.')
    })
  }

  /**
   * Récupère un fichier depuis S3 et l'ajoute à l'archive
   * @param {string} key - La clé de l'objet S3
   * @param {archiver.Archiver} archive - L'archive dans laquelle ajouter le fichier
   * @param {string} pathFilename - Le chemin du dossier ou du fichier dans le bucket
   * @param {string} bucketName - Le nom du bucket S3
   * @returns {Promise<void>}
   */
  private static async fetchAndAppendFile(
    key: string,
    archive: archiver.Archiver,
    pathFilename: string,
    bucketName: string,
  ): Promise<void> {
    const getObjectCommand: GetObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    try {
      const { Body } = await s3Client.send(getObjectCommand)

      if (Body) {
        let baseDirectoryName: string | undefined
        let fullFileName: string | undefined

        // Vérifie si pathFilename est un dossier ou un fichier
        if (pathFilename.endsWith('/')) {
          // C'est un dossier
          baseDirectoryName = pathFilename
            .split('/')
            .filter((part: string): boolean => part.length > 0)
            .pop()
          let relativePath: string = key.substring(pathFilename.length)
          if (relativePath.startsWith('/')) {
            relativePath = relativePath.substring(1)
          }
          fullFileName = `${baseDirectoryName}/${relativePath}`
        } else {
          // C'est un fichier
          baseDirectoryName = pathFilename.split('/').pop()
          fullFileName = baseDirectoryName
        }

        // @ts-ignore
        archive.append(Body, { name: fullFileName })
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération du fichier ${key} :`, error)
    }
  }

  /**
   * Crée un bucket S3
   * @param {string} bucketName - Le nom du bucket à créer
   * @returns {Promise<void>}
   */
  public static async createBucket(bucketName: string): Promise<void> {
    const params: CreateBucketCommandInput = {
      Bucket: bucketName,
    }

    const command: CreateBucketCommand = new CreateBucketCommand(params)

    try {
      const output: CreateBucketCommandOutput = await s3Client.send(command)
      logger.info(`Bucket ${output} created successfully`)
    } catch (error: any) {
      logger.error(`Error creating bucket: ${error.message}`)
    }
  }

  /**
   * Supprime un bucket S3
   * @param {string} bucketName - Le nom du bucket à supprimer
   * @returns {Promise<void>}
   */
  public static async deleteBucket(bucketName: string): Promise<void> {
    try {
      const command: DeleteBucketCommand = new DeleteBucketCommand({
        Bucket: bucketName,
      })
      const output: DeleteBucketCommandOutput = await s3Client.send(command)
      logger.info(`Bucket ${output} deleted successfully`)
    } catch (error: any) {
      logger.error(`Error deleting bucket: ${error.message}`)
    }
  }

  /**
   * Récupère la liste des fichiers dans un bucket S3 avec un préfixe donné
   * @param {string} bucketName - Le nom du bucket S3
   * @param {string} pathFilename - Le préfixe des fichiers à lister
   * @returns {Promise<ExtendedFile[] | undefined>} - Liste des fichiers étendus dans le bucket
   */
  public static async getListFilesObjectInBucket(
    bucketName: string,
    pathFilename: string,
  ): Promise<ExtendedFile[] | undefined> {
    const params: ListObjectsV2CommandInput = {
      Bucket: bucketName,
      Prefix: pathFilename,
    }
    const files: ExtendedFile[] = []
    let continuationToken: string | undefined

    do {
      try {
        const listObjects: ListObjectsV2Command = new ListObjectsV2Command({
          ...params,
          ContinuationToken: continuationToken,
        })

        const data: ListObjectsV2CommandOutput = await s3Client.send(listObjects)

        if (data.Contents) {
          data.Contents.forEach((obj: _Object): void => {
            if (obj.Key) {
              const fileData: ExtendedFile = {
                Key: obj.Key,
                LastModified: obj.LastModified ? DateTime.fromJSDate(obj.LastModified) : undefined,
                Size: obj.Size || undefined,
              }
              files.push(fileData)
            }
          })
        }

        continuationToken = data.NextContinuationToken
      } catch (error) {
        throw new Error(`Error : ${error.message}`)
      }
    } while (continuationToken)

    if (files.length === 0) return undefined

    return files
  }

  /**
   * Récupère tous les buckets S3 et leurs informations étendues
   * @returns {Promise<ExtendedBucket[] | undefined>} - Liste des buckets étendus
   */
  public static async getAllBuckets(): Promise<ExtendedBucket[] | undefined> {
    try {
      const bucketsInDatabase: MyBucket[] = await MyBucket.query().orderBy('id', 'asc')
      logger.info(`getAllBuckets Retrieved ${bucketsInDatabase.length} buckets from database`)

      if (bucketsInDatabase.length === 0) {
        return []
      }

      const dataBucketsUpdated: ExtendedBucket[] = await Promise.all(
        bucketsInDatabase.map(async (dbBucket: MyBucket): Promise<ExtendedBucket> => {
          let totalObjects: number = 0
          let totalSize: number = 0
          let continuationToken: string | undefined

          do {
            try {
              const listObjectsCommand: ListObjectsV2Command = new ListObjectsV2Command({
                Bucket: dbBucket.name,
                ContinuationToken: continuationToken,
              })

              const objectsData: ListObjectsV2CommandOutput = await s3Client.send(listObjectsCommand)
              totalObjects += objectsData.KeyCount || 0
              totalSize +=
                objectsData.Contents?.reduce((acc: number, obj: _Object): number => acc + (obj.Size || 0), 0) || 0
              continuationToken = objectsData.NextContinuationToken
            } catch (error: unknown) {
              const errorMessage: string = error instanceof Error ? error.message : 'Unknown error'
              logger.warn(
                `getAllBuckets Cannot list objects for bucket "${dbBucket.name}": ${errorMessage}. Returning metadata only.`,
              )
              totalObjects = 0
              totalSize = 0
              continuationToken = undefined
            }
          } while (continuationToken)

          let access: Grant[] | undefined
          try {
            const getAclCommand: GetBucketAclCommand = new GetBucketAclCommand({
              Bucket: dbBucket.name,
            })
            const aclData: GetBucketAclCommandOutput = await s3Client.send(getAclCommand)
            access = aclData.Grants
          } catch (error: unknown) {
            const errorMessage: string = error instanceof Error ? error.message : 'Unknown error'
            logger.warn(`getAllBuckets Cannot read ACL for bucket "${dbBucket.name}": ${errorMessage}`)
          }

          return {
            id: dbBucket.id,
            name: dbBucket.name,
            visibility: dbBucket.visibility,
            createdAt: dbBucket.createdAt ?? undefined,
            updatedAt: dbBucket.updatedAt ?? undefined,
            totalObjects: totalObjects,
            totalSize: totalSize,
            access: access,
          }
        }),
      )

      return dataBucketsUpdated
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Unknown error'
      logger.error(`getAllBuckets Error retrieving buckets: ${errorMessage}`)
    }
  }

  /**
   *
   */
  public static getFileWithPathFileNameAndBucketName(fileCommand: {
    pathFilename: string
    bucketName: string
  }): Promise<File | null> {
    try {
      return File.query()
        .preload('bucket')
        .where('pathfilename', fileCommand.pathFilename)
        .whereHas('bucket', (query: RelationSubQueryBuilderContract<typeof MyBucket>): void => {
          query.where('name', fileCommand.bucketName)
        })
        .first()
    } catch (error: any) {
      logger.error(`Error fetching file with path and bucket name: ${error.message}`)

      throw new InternalServerErrorException('Error fetching file with path and bucket name')
    }
  }

  /**
   *
   */
  public static async getTotalSizeFileOrFolderInBucket(bucketName: string, pathFilename: string): Promise<number> {
    const params: ListObjectsV2CommandInput = {
      Bucket: bucketName,
      Prefix: pathFilename,
    }

    let totalSize: number = 0
    let continuationToken: string | undefined

    do {
      try {
        const listObjects: ListObjectsV2Command = new ListObjectsV2Command({
          ...params,
          ContinuationToken: continuationToken,
        })

        const data: ListObjectsV2CommandOutput = await s3Client.send(listObjects)

        if (data.Contents) {
          totalSize += data.Contents.reduce((acc: number, obj: _Object) => acc + (obj.Size || 0), 0)
        }

        continuationToken = data.NextContinuationToken
      } catch (error) {
        throw new Error(`Error : ${error.message}`)
      }
    } while (continuationToken)

    return totalSize
  }
}
