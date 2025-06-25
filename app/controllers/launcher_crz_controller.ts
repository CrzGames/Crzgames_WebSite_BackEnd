import type { HttpContext } from '@adonisjs/core/http'
import CloudStorageS3Service from '#services/cloud_storage_s3_service'
import env from '#start/env'

export default class LauncherCrzController {
  public async checkIsAvailableVersionLauncher(ctx: HttpContext): Promise<void> {
    const contentString: string = await CloudStorageS3Service.getFileContent(
      'crzgames-public',
      'launcher/updater/updater-launcher.json',
    )
    const contentJSON = JSON.parse(contentString)
    ctx.response.json(contentJSON)
  }

  public async downloadLauncher(ctx: HttpContext): Promise<void> {
    await CloudStorageS3Service.streamDownloadFileOrFolderInBucketForLauncher(
      ctx,
      `launcher/download/${ctx.params.nameBundle}`,

      'crzgames-public',
    )
  }
}
