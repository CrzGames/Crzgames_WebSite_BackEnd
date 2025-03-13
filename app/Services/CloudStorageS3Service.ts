import {
  S3Client,
  CreateBucketCommand,
  ListBucketsCommand,
  DeleteBucketCommand,
  DeleteBucketCommandOutput,
  CreateBucketCommandOutput,
  ListBucketsCommandOutput,
  Bucket,
  GetObjectCommand,
  GetObjectCommandOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  GetBucketAclCommand,
  GetBucketAclCommandOutput,
  Grant,
  _Object,
  CreateBucketCommandInput,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import Logger from '@ioc:Adonis/Core/Logger'
import Env from '@ioc:Adonis/Core/Env'
import Drive, { DriveFileStats } from '@ioc:Adonis/Core/Drive'
import MyBucket from 'App/Models/Bucket'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import File from 'App/Models/File'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import fs from 'fs'
import { promisify } from 'util'
import { ListObjectsV2CommandInput } from '@aws-sdk/client-s3/dist-types/commands/ListObjectsV2Command'
import { Buffer } from 'buffer'
import { DateTime } from 'luxon'
import archiver from 'archiver'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const readFile = promisify(fs.readFile)

// Documentation Client S3 AWS v3 for Node.js : https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/
const s3Client: S3Client = new S3Client({
  credentials: {
    accessKeyId: Env.get('S3_KEY') as string,
    secretAccessKey: Env.get('S3_SECRET_KEY') as string,
  },
  region: Env.get('S3_REGION') as string,
  endpoint: Env.get('S3_ENDPOINT') as string,
  forcePathStyle: true,
})

export type BucketFileCommand = {
  pathFilename: string
  bucketName: string
  // 'File' pour les assets real et 'localPath' pour les assets local pour les seeders (pour develop)
  file?: MultipartFileContract
  files?: MultipartFileContract[]
  localPath?: string
}

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

export type ExtendedFile = {
  Key: string
  LastModified?: DateTime
  Size?: number
}

export default class CloudStorageS3Service {
  public static async getBucketByName(bucketName: string): Promise<MyBucket> {
    try {
      const bucket: MyBucket | null = await MyBucket.query().where('name', bucketName).first()

      if (!bucket) {
        throw new NotFoundException(`Aucun bucket trouvé avec le nom: ${bucketName}`)
      }

      return bucket
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  public static async getFileContent(bucketName: string, pathFilename: string): Promise<string> {
    try {
      // Fetch le bucket en question dans la db pour récupérer la visibility du bucket
      const bucket: MyBucket = await this.getBucketByName(bucketName)

      // Avant de sauvegarder le fichier dans le bucket on set le bucket courant et la visibilité courante
      await this.setBucketCurrent(bucket.name)
      await this.setVisibilityBucketCurrent(bucket.visibility)

      const command: GetObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: pathFilename,
      })
      const response: GetObjectCommandOutput = await s3Client.send(command)

      if (!response.Body) {
        throw new InternalServerErrorException('Error while fetching file content')
      } else {
        return await response.Body.transformToString('utf-8')
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  public static async replaceHostInUrl(url: string): Promise<any> {
    return url.replace('host.docker.internal', 'localhost')
  }

  public static async uploadFileOrFolderInBucket(bucketFile: BucketFileCommand): Promise<void> {
    // Fetch le bucket en question dans la db pour récupérer la visibility du bucket
    const bucket: MyBucket = await this.getBucketByName(bucketFile.bucketName)

    // Avant de sauvegarder le fichier dans le bucket ont set le bucket courant et la visibilité courante
    await this.setBucketCurrent(bucket.name)
    await this.setVisibilityBucketCurrent(bucket.visibility)

    if (bucketFile.files) {
      // Handle multiple files
      for (const file of bucketFile.files) {
        if (file.state === 'consumed' && file.tmpPath) {
          const fileContentBuffer: Buffer = await readFile(file.tmpPath)
          const filePath: string = `${bucketFile.pathFilename}/${file.clientName}`
          console.log('uploadFileOrFolderInBucket : ' + filePath)
          await Drive.put(filePath, fileContentBuffer)
        }
      }
    } else {
      // Handle single file or localPath
      let fileContentBuffer
      if (bucketFile.localPath) {
        fileContentBuffer = await readFile(bucketFile.localPath)
      } else if (
        bucketFile.file &&
        bucketFile.file.state === 'consumed' &&
        bucketFile.file.tmpPath
      ) {
        fileContentBuffer = await readFile(bucketFile.file.tmpPath)
      }
      console.log('Uploading to path:', bucketFile.pathFilename)
      await Drive.put(bucketFile.pathFilename, fileContentBuffer)
    }
  }

  public static async createFileInDB(bucketFile: BucketFileCommand): Promise<File> {
    // Vérifier si le fichier existe déjà dans la DB
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
      buckets_id: bucket.id,
      pathfilename: bucketFile.pathFilename,
      url: bucketFile.pathFilename,
      size: totalSize,
    })
    // Charger (manuellement) la relation "bucket" pour éviter l'erreur dans le getter "url"
    file.$setRelated('bucket', bucket)
    return file
  }

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
        buckets_id: bucket.id,
        pathfilename: bucketFile.pathFilename,
        url: bucketFile.pathFilename,
        size: totalSize,
      })
      .save()
  }

  private static async deleteFolderInBucketAndDB(
    bucketName: string,
    folderPath: string,
  ): Promise<void> {
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
          const fileOrFolder: File | null = await File.query()
            .preload('bucket')
            .where('pathfilename', item.Key)
            .first()

          if (fileOrFolder) {
            await fileOrFolder.delete()
          }
        }
      }

      const deleteParams = {
        Bucket: bucketName,
        Delete: {
          Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
        },
      }

      const deleteCommand: DeleteObjectsCommand = new DeleteObjectsCommand(deleteParams)
      await s3Client.send(deleteCommand)

      if (listedObjects.IsTruncated) await this.deleteFolderInBucketAndDB(bucketName, folderPath)
    } catch (error) {
      Logger.error(`Error deleteFolderInBucket: ${error.message}`)
      throw new Error(`Error deleteFolderInBucket: ${error.message}`)
    }
  }

  private static async deleteFileInBucketAndDB(pathFilename: string): Promise<void> {
    try {
      if (await Drive.exists(pathFilename)) {
        await Drive.delete(pathFilename)

        // Check si le fichier est utilisé en base de donnée si c'est le cas le supprime
        const file: File | null = await File.query()
          .preload('bucket')
          .where('pathfilename', pathFilename)
          .first()

        if (file !== null && file !== undefined) {
          await file.delete()
        }

        Logger.info('deleteFileInBucketAndDB delete file success')
      } else {
        Logger.warn('deleteFileInBucketAndDB pathfilename no exist for file')
      }
    } catch (error) {
      Logger.error(`Error deleteFileInBucketAndDB: ${error.message}`)
      throw new Error(`Error deleteFileInBucketAndDB: ${error.message}`)
    }
  }

  public static async deleteInBucketAndDB(pathFilename: string, bucketName: string): Promise<void> {
    try {
      // Choisi le bucket
      const bucket: MyBucket = await this.getBucketByName(bucketName)
      await this.setBucketCurrent(bucket.name)
      await this.setVisibilityBucketCurrent(bucket.visibility)

      // Si c'est une demande de suppression d'un dossier
      if (pathFilename.endsWith('/')) {
        await this.deleteFolderInBucketAndDB(bucketName, pathFilename)
      } else {
        // Si c'est une demande de suppression d'un fichier
        await this.deleteFileInBucketAndDB(pathFilename)
      }
    } catch (error) {
      Logger.error(`Error deleteInBucketAndDB: ${error.message}`)
      throw new Error(`Error deleteInBucketAndDB: ${error.message}`)
    }
  }

  public static async getURLToFileInBucket(pathFilename: string): Promise<string | undefined> {
    try {
      if (await Drive.exists(pathFilename)) {
        Logger.info('getFileInBucket success pathfilename for file')
        const fileUrl: string = await Drive.getUrl(pathFilename)

        if (Env.get('NODE_ENV') === 'development') return this.replaceHostInUrl(fileUrl)
        return fileUrl
      } else {
        Logger.warn('getFileInBucket pathfilename no exist for file')
      }
    } catch (error) {
      Logger.error(`Error getFileInBucket: ${error.message}`)
      throw new Error(`Error getFileInBucket: ${error.message}`)
    }
  }

  public static getOperatingSystem(userAgent: string): string {
    if (userAgent.includes('Win')) return 'Windows'
    if (userAgent.includes('Mac')) return 'MacOS'
    if (userAgent.includes('X11')) return 'UNIX'
    if (userAgent.includes('Linux')) return 'Linux'
    return 'Unknown'
  }

  private static async fetchAllObjects(bucketName: string, prefix: string): Promise<_Object[]> {
    let continuationToken: string | undefined
    let contents: _Object[] = []

    do {
      const listParams = {
        Bucket: bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }
      const response: ListObjectsV2CommandOutput = await s3Client.send(
        new ListObjectsV2Command(listParams),
      )
      contents = contents.concat(response.Contents || [])
      continuationToken = response.NextContinuationToken
    } while (continuationToken)

    return contents
  }

  public static async streamDownloadFileOrFolderInBucketForLauncher(
    ctx: HttpContextContract,
    pathFilename: string,
    bucketName: string,
  ): Promise<void> {
    Logger.info(
      `Début du téléchargement pour le chemin : ${pathFilename} dans le bucket : ${bucketName}`,
    )

    const bucket: MyBucket = await this.getBucketByName(bucketName)
    await this.setBucketCurrent(bucket.name)
    await this.setVisibilityBucketCurrent(bucket.visibility)

    try {
      // Vérifier si le chemin est une application macOS (.app)
      if (pathFilename.endsWith('.app')) {
        // Utilisation directe de l'objet response natif de Node.js pour CORS ou autres en-têtes critiques
        const zipFilename: string = `${pathFilename.split('/').pop()}.zip`

        ctx.response.response.setHeader('Content-Type', 'application/zip')
        ctx.response.response.setHeader('Access-Control-Allow-Origin', '*')
        ctx.response.response.setHeader(
          'Content-Disposition',
          `attachment; filename="${zipFilename}"`,
        )
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
              const objectStream: NodeJS.ReadableStream = await this.getObjectStream(
                bucketName,
                item.Key,
              )
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
      if (await Drive.exists(pathFilename)) {
        const driveFileStats: DriveFileStats = await Drive.getStats(pathFilename)
        if (driveFileStats.isFile) {
          // Gestion des fichiers
          const fileStream: NodeJS.ReadableStream = await Drive.getStream(pathFilename)

          ctx.response.response.setHeader('Content-Type', 'application/octet-stream')
          ctx.response.response.setHeader(
            'Content-Disposition',
            `attachment; filename="${pathFilename.split('/').pop()}"`,
          )
          ctx.response.response.setHeader('Content-Length', driveFileStats.size.toString())

          return ctx.response.stream(fileStream)
        }
      }

      throw new NotFoundException('File or folder not found')
    } catch (error) {
      Logger.error(
        'Erreur lors de la vérification du chemin ou de la génération du fichier :',
        error,
      )
      throw new NotFoundException('File or folder not found')
    }
  }

  // Méthode pour obtenir un flux d'objet depuis S3
  private static async getObjectStream(
    bucketName: string,
    key: string,
  ): Promise<NodeJS.ReadableStream> {
    const getObjectParams = {
      Bucket: bucketName,
      Key: key,
    }
    const command: GetObjectCommand = new GetObjectCommand(getObjectParams)
    const { Body } = await s3Client.send(command)
    return Body as NodeJS.ReadableStream
  }

  public static async streamDownloadFileOrFolderInBucket(
    ctx: HttpContextContract,
    pathFilename: string,
    bucketName: string,
  ): Promise<void> {
    Logger.info(
      `Début du téléchargement pour le chemin : ${pathFilename} dans le bucket : ${bucketName}`,
    )

    const bucket: MyBucket = await this.getBucketByName(bucketName)
    await this.setBucketCurrent(bucket.name)
    await this.setVisibilityBucketCurrent(bucket.visibility)

    // Vérifier si le chemin se termine par '.zip' (donc pas besoin d'archiver)
    if (pathFilename.endsWith('.zip')) {
      Logger.info('Téléchargement direct d un fichier ZIP détecté')

      if (await Drive.exists(pathFilename)) {
        const fileStream: NodeJS.ReadableStream = await Drive.getStream(pathFilename)
        const { size } = await Drive.getStats(pathFilename)

        ctx.response.response.setHeader('Content-Type', 'application/zip')
        ctx.response.response.setHeader(
          'Content-Disposition',
          `attachment; filename="${pathFilename.split('/').pop()}"`,
        )
        ctx.response.response.setHeader('Content-Length', size.toString())

        return ctx.response.stream(fileStream)
      }

      throw new NotFoundException('Fichier ZIP non trouvé')
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

  public static async createBucket(bucketName: string): Promise<void> {
    const params: CreateBucketCommandInput = {
      Bucket: bucketName,
    }

    const command: CreateBucketCommand = new CreateBucketCommand(params)

    try {
      const output: CreateBucketCommandOutput = await s3Client.send(command)
      Logger.info(`Bucket ${output} created successfully`)
    } catch (error: any) {
      Logger.error(`Error creating bucket: ${error.message}`)
    }
  }

  public static async deleteBucket(bucketName: string): Promise<void> {
    const command: DeleteBucketCommand = new DeleteBucketCommand({
      Bucket: bucketName,
    })

    try {
      const output: DeleteBucketCommandOutput = await s3Client.send(command)
      Logger.info(`Bucket ${output} deleted successfully`)
    } catch (error: any) {
      Logger.error(`Error deleting bucket: ${error.message}`)
    }
  }

  public static async getVisibilityBucketCurrent(): Promise<string> {
    const s3VisiblityBucketCurrent: string = Env.get('S3_VISIBILITY') as string
    Logger.info('getVisibilityBucketCurrent' + s3VisiblityBucketCurrent)
    return s3VisiblityBucketCurrent
  }

  public static async setVisibilityBucketCurrent(visibility: string): Promise<void> {
    if (visibility === 'public' || visibility === 'private') {
      Logger.info('setVisibilityBucketCurrent new value : ' + visibility)
      Env.set('S3_VISIBILITY', visibility)
    } else {
      Logger.warn(
        'setVisibilityBucketCurrent no value autorized just public or private value is ok',
      )
    }
  }

  public static async setBucketCurrent(newBucketCurrent: string): Promise<void> {
    Logger.info('setBucketCurrent : ' + newBucketCurrent)
    Env.set('S3_BUCKET', newBucketCurrent)
  }

  public static async getBucketCurrent(): Promise<string> {
    const s3BucketCurrent: string = Env.get('S3_BUCKET') as string
    Logger.info('getBucketCurrent' + s3BucketCurrent)
    return s3BucketCurrent
  }

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

    if (!files || files.length === 0) return undefined

    return files
  }

  public static async getAllBuckets(): Promise<ExtendedBucket[] | undefined> {
    const input = {}
    const command: ListBucketsCommand = new ListBucketsCommand(input)

    try {
      const data: ListBucketsCommandOutput = await s3Client.send(command)
      Logger.info(`getAllBuckets Retrieved ${data.Buckets?.length} buckets`)

      // Si aucun bucket n'est trouvé, retournez simplement un tableau vide
      if (!data.Buckets) {
        return []
      }

      // Récupérez les données de visibilité pour chaque bucket
      const dataBucketsUpdated = await Promise.all(
        data.Buckets.map(async (bucket: Bucket) => {
          let dbBucket: MyBucket | null = null

          if (bucket.Name !== undefined) {
            dbBucket = await this.getBucketByName(bucket.Name)

            // Fetch number of objects and total size
            let totalObjects: number = 0
            let totalSize: number = 0
            let continuationToken: string | undefined

            do {
              const listObjectsCommand: ListObjectsV2Command = new ListObjectsV2Command({
                Bucket: bucket.Name,
                ContinuationToken: continuationToken, // Utilisez ContinuationToken pour la pagination
              })

              const objectsData: ListObjectsV2CommandOutput =
                await s3Client.send(listObjectsCommand)
              totalObjects += objectsData.KeyCount || 0
              totalSize += objectsData.Contents?.reduce((acc, obj) => acc + (obj.Size || 0), 0) || 0
              continuationToken = objectsData.NextContinuationToken
            } while (continuationToken)

            // Fetch ACL
            const getAclCommand: GetBucketAclCommand = new GetBucketAclCommand({
              Bucket: bucket.Name,
            })
            const aclData: GetBucketAclCommandOutput = await s3Client.send(getAclCommand)
            const access: Grant[] | undefined = aclData.Grants

            // Create the extended bucket data
            const extendedBucket: ExtendedBucket = {
              id: dbBucket?.id,
              name: bucket.Name,
              visibility: dbBucket?.visibility,
              createdAt: dbBucket?.createdAt,
              updatedAt: dbBucket?.updatedAt,
              totalObjects: totalObjects,
              totalSize: totalSize,
              access: access,
            }

            return extendedBucket
          }

          // If no dbBucket info, just return the basic bucket data in ExtendedBucket format.
          return {
            name: bucket.Name,
          }
        }),
      )

      return dataBucketsUpdated.filter(
        (bucket: ExtendedBucket): boolean => bucket.name !== undefined,
      ) as ExtendedBucket[]
    } catch (error: any) {
      Logger.error(`getAllBuckets Error retrieving buckets: ${error.message}`)
    }
  }

  public static getFileWithPathFileNameAndBucketName(fileCommand: {
    pathFilename: string
    bucketName: string
  }): Promise<File | null> {
    return File.query()
      .preload('bucket')
      .where('pathfilename', fileCommand.pathFilename)
      .whereHas('bucket', (query) => {
        query.where('name', fileCommand.bucketName)
      })
      .first()
  }

  public static async getTotalSizeFileOrFolderInBucket(
    bucketName: string,
    pathFilename: string,
  ): Promise<number> {
    // Fetch le bucket en question dans la db pour récupérer la visibility du bucket
    const bucket: MyBucket = await this.getBucketByName(bucketName)

    // Avant de sauvegarder le fichier dans le bucket ont set le bucket courant et la visibilité courante
    await this.setBucketCurrent(bucket.name)
    await this.setVisibilityBucketCurrent(bucket.visibility)

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
