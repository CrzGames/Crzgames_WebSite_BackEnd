import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CloudStorageS3Service from 'App/Services/CloudStorageS3Service'
import Env from '@ioc:Adonis/Core/Env'

export default class LauncherCrzController {
  private async checkIsAvailableVersionLauncher(ctx: HttpContextContract): Promise<void> {
    const contentString: string = await CloudStorageS3Service.getFileContent(
      'crzgames-public',
      'launcher/updater/updater-launcher.json',
    )
    const contentJSON = JSON.parse(contentString)
    ctx.response.json(contentJSON)
  }

  private async downloadLauncher(ctx: HttpContextContract): Promise<void> {
    await CloudStorageS3Service.streamDownloadFileOrFolderInBucketForLauncher(
      ctx,
      `launcher/download/${ctx.params.nameBundle}`,

      'crzgames-public',
    )
  }
}
