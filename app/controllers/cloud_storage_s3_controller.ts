import type { HttpContext } from '@adonisjs/core/http'
import CloudStorageS3Service from '#services/cloud_storage_s3_service'
import type { ExtendedBucket, ExtendedFile, BucketFileCommand } from '#services/cloud_storage_s3_service'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

/**
 *
 */
export default class CloudStorageS3Controller {
  /**
   *
   */
  public async getAllBuckets({ response }: HttpContext): Promise<void> {
    const buckets: ExtendedBucket[] | undefined = await CloudStorageS3Service.getAllBuckets()

    if (buckets === undefined) {
      response.status(404).json({ error: 'Buckets not found' })
    } else {
      response.status(200).json(buckets)
    }
  }

  /**
   *
   */
  public async getListFilesObjectInBucket({ request, response }: HttpContext): Promise<void> {
    const payload: Record<string, string> = request.all()
    const listObjectsS3: ExtendedFile[] | undefined = await CloudStorageS3Service.getListFilesObjectInBucket(
      payload.bucketName,
      payload.path,
    )

    if (listObjectsS3 === undefined) {
      response.status(404).json({ error: 'Files or folders not found in bucket' })
    } else {
      response.status(200).json(listObjectsS3)
    }
  }

  /**
   *
   */
  public async deleteInBucketAndDB({ request, response }: HttpContext): Promise<void> {
    const payload: Record<string, string> = request.all()
    await CloudStorageS3Service.deleteInBucketAndDB(payload.pathFilename, payload.bucketName)
    response.status(204).ok('deleteFileInBucketAndDB success')
  }

  /**
   *
   */
  public async streamDownloadFileInBucketForLauncher(ctx: HttpContext): Promise<void> {
    const payload: Record<string, string> = ctx.request.all()
    await CloudStorageS3Service.streamDownloadFileOrFolderInBucketForLauncher(
      ctx,
      payload.pathFilename,
      payload.bucketName,
    )
  }

  /**
   * Retourne une URL pre-signee de telechargement S3 pour le launcher
   * @param {HttpContext} ctx
   * @returns {Promise<void>}
   */
  public async getPresignedDownloadUrlForLauncher({ request, response }: HttpContext): Promise<void> {
    const payload: Record<string, string> = request.all()
    const expiresIn: number = Number(payload.expiresIn) || 900
    const presignedUrl: string = await CloudStorageS3Service.getPresignedDownloadUrlForLauncher(
      payload.bucketName,
      payload.pathFilename,
      expiresIn,
    )

    response.status(200).json({
      url: presignedUrl,
      expiresIn: Math.max(60, Math.min(expiresIn, 3600)),
      bucketName: payload.bucketName,
      pathFilename: payload.pathFilename,
    })
  }

  /**
   * Download file or folder in bucket
   * Via le site crzgames et le launcher deux choses bien different
   * @param ctx
   * @private
   */
  public async downloadFileOrFolderInBucket(ctx: HttpContext): Promise<void> {
    const payload: Record<string, string> = ctx.request.all()
    await CloudStorageS3Service.streamDownloadFileOrFolderInBucket(ctx, payload.pathFilename, payload.bucketName)
  }

  /**
   *
   */
  public async uploadFileOrFolderInBucket({ request, response }: HttpContext): Promise<void> {
    const payloadFiles: Record<string, MultipartFile | MultipartFile[]> = request.allFiles()
    const payloadBucketName: string = request.input('bucketName')
    const payloadPathFilename: string = request.input('pathFilename', '')

    const bucketFileCommand: BucketFileCommand = {
      pathFilename: payloadPathFilename,
      bucketName: payloadBucketName,
      files: payloadFiles['files'] as MultipartFile[] | undefined,
      file: payloadFiles['file'] as MultipartFile | undefined,
    }

    await CloudStorageS3Service.uploadFileOrFolderInBucket(bucketFileCommand)
    response.status(201).ok('uploadFileOrFolderInBucket success')
  }

  /**
   *
   */
  public async getTotalSizeFileOrFolderInBucket({ request, response }: HttpContext): Promise<void> {
    const payload: Record<string, string> = request.all()

    try {
      const totalSize: number = await CloudStorageS3Service.getTotalSizeFileOrFolderInBucket(
        payload.bucketName,
        payload.pathFilename,
      )
      response.status(200).json({ totalSize })
    } catch (error: any) {
      response.status(500).json({ error: error.message })
    }
  }

  /**
   *
   */
  public async getFileContentInBucket({ response, request }: HttpContext): Promise<void> {
    const payload: Record<string, string> = request.all()

    const contentString: string = await CloudStorageS3Service.getFileContent(payload.bucketName, payload.pathFilename)
    const contentJSON: unknown = JSON.parse(contentString)
    response.json(contentJSON)
  }
}
