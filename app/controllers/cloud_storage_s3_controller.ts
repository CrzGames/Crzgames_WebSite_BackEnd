import type { HttpContext } from '@adonisjs/core/http'
import CloudStorageS3Service, {
  BucketFileCommand,
  ExtendedBucket,
  ExtendedFile,
} from '#services/cloud_storage_s3_service'
import { MultipartFileContract } from '@adonisjs/core/bodyparser'

export default class CloudStorageS3Controller {
  public async getAllBuckets({ response }: HttpContext): Promise<void> {
    const buckets: ExtendedBucket[] | undefined = await CloudStorageS3Service.getAllBuckets()

    if (buckets === undefined) {
      response.status(404).json({ error: 'Buckets not found' })
    } else {
      response.status(200).json(buckets)
    }
  }

  public async getListFilesObjectInBucket({
    request,
    response,
  }: HttpContext): Promise<void> {
    const payload: Record<string, any> = request.all()
    const listObjectsS3: ExtendedFile[] | undefined =
      await CloudStorageS3Service.getListFilesObjectInBucket(payload.bucketName, payload.path)

    if (listObjectsS3 === undefined) {
      response.status(404).json({ error: 'Files or folders not found in bucket' })
    } else {
      response.status(200).json(listObjectsS3)
    }
  }

  public async deleteInBucketAndDB({ request, response }: HttpContext): Promise<void> {
    const payload: Record<string, any> = request.all()
    await CloudStorageS3Service.deleteInBucketAndDB(payload.pathFilename, payload.bucketName)
    response.status(204).ok('deleteFileInBucketAndDB success')
  }

  public staticpublic async streamDownloadFileInBucketForLauncher(
    ctx: HttpContext,
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
  public async downloadFileOrFolderInBucket(ctx: HttpContext): Promise<void> {
    const payload: Record<string, any> = ctx.request.all()
    await CloudStorageS3Service.streamDownloadFileOrFolderInBucket(
      ctx,
      payload.pathFilename,
      payload.bucketName,
    )
  }

  public async uploadFileOrFolderInBucket({
    request,
    response,
  }: HttpContext): Promise<void> {
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

  public async getTotalSizeFileOrFolderInBucket({
    request,
    response,
  }: HttpContext): Promise<void> {
    const payload: Record<string, any> = request.all()

    try {
      const totalSize: number = await CloudStorageS3Service.getTotalSizeFileOrFolderInBucket(
        payload.bucketName,
        payload.pathFilename,
      )
      response.status(200).json({ totalSize })
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  }

  public async getFileContentInBucket({ response, request }: HttpContext): Promise<void> {
    const payload: Record<string, any> = request.all()

    const contentString: string = await CloudStorageS3Service.getFileContent(
      payload.bucketName,
      payload.pathFilename,
    )
    const contentJSON = JSON.parse(contentString)
    response.json(contentJSON)
  }
}
