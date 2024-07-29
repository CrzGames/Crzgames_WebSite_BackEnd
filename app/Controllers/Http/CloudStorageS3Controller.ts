import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CloudStorageS3Service, {
  BucketFileCommand,
  ExtendedBucket,
  ExtendedFile,
} from 'App/Services/CloudStorageS3Service'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

export default class CloudStorageS3Controller {
  private async getAllBuckets({ response }: HttpContextContract): Promise<void> {
    const buckets: ExtendedBucket[] | undefined = await CloudStorageS3Service.getAllBuckets()

    if (buckets === undefined) {
      response.status(404).json({ error: 'Buckets not found' })
    } else {
      response.status(200).json(buckets)
    }
  }

  private async getListFilesObjectInBucket({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: Record<string, any> = request.all()
    const listObjectsS3: ExtendedFile[] | undefined =
      await CloudStorageS3Service.getListFilesObjectInBucket(payload.bucketName, payload.path)

    if (listObjectsS3 === undefined) {
      response.status(404).json({ error: 'Files or folders not found in bucket' })
    } else {
      response.status(200).json(listObjectsS3)
    }
  }

  private async deleteInBucketAndDB({ request, response }: HttpContextContract): Promise<void> {
    const payload: Record<string, any> = request.all()
    await CloudStorageS3Service.deleteInBucketAndDB(payload.pathFilename, payload.bucketName)
    response.status(204).ok('deleteFileInBucketAndDB success')
  }

  public static async streamDownloadFileInBucketForLauncher(
    ctx: HttpContextContract,
  ): Promise<void> {
    const payload: Record<string, any> = ctx.request.all()
    await CloudStorageS3Service.streamDownloadFileOrFolderInBucketForLauncher(
      ctx,
      payload.pathFilename,
      payload.bucketName,
    )
  }

  /**
   * Download file or folder in bucket
   * Via le site crzgames et le launcher deux choses bien diffèrent
   * @param ctx
   * @private
   */
  private async downloadFileOrFolderInBucket(ctx: HttpContextContract): Promise<void> {
    const payload: Record<string, any> = ctx.request.all()
    await CloudStorageS3Service.streamDownloadFileOrFolderInBucket(
      ctx,
      payload.pathFilename,
      payload.bucketName,
    )
  }

  private async uploadFileOrFolderInBucket({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payloadFiles = request.allFiles()
    const payloadBucketName: string = request.input('bucketName')
    let payloadPathFilename: string = request.input('pathFilename')

    // Si jamais le path est à la racine du bucket ça sera == null, donc mettre : ''
    payloadPathFilename =
      payloadPathFilename === null || payloadPathFilename === undefined ? '' : payloadPathFilename

    const bucketFileCommand: BucketFileCommand = {
      pathFilename: payloadPathFilename,
      bucketName: payloadBucketName,
      files: payloadFiles['files'] as MultipartFileContract[] | undefined,
      file: payloadFiles['file'] as MultipartFileContract | undefined,
    }

    await CloudStorageS3Service.uploadFileOrFolderInBucket(bucketFileCommand)
    response.status(201).ok('uploadFileOrFolderInBucket success')
  }

  private async getTotalSizeFileOrFolderInBucket({ request, response }: HttpContextContract): Promise<void> {
    const payload: Record<string, any> = request.all()

    try {
      const totalSize: number = await CloudStorageS3Service.getTotalSizeFileOrFolderInBucket(payload.bucketName, payload.pathFilename)
      response.status(200).json({ totalSize })
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  }

  private async getFileContentInBucket({ response, request }: HttpContextContract): Promise<void> {
    const payload: Record<string, any> = request.all()

    const contentString: string = await CloudStorageS3Service.getFileContent(
      payload.bucketName,
      payload.pathFilename,
    )
    const contentJSON = JSON.parse(contentString)
    response.json(contentJSON)
  }
}
