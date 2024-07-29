import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import path from 'path'
import fs from 'fs/promises'
import Game from 'App/Models/Game'
import GameBinary from 'App/Models/GameBinary'
import GamePlatform from 'App/Models/GamePlatform'
import File from 'App/Models/File'
import CloudStorageS3Service from 'App/Services/CloudStorageS3Service'
import Logger from '@ioc:Adonis/Core/Logger'

export default class GameBinarySeeder extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    Logger.info('GameBinarySeeder Start.')

    const games: Game[] = await Game.all()
    for (const game of games) {
      await this.processPlatform(game, 'Windows', 'MyGameWindows')
      await this.processPlatform(game, 'macOS', 'MyGameMacOS')
      await this.processPlatform(game, 'Linux', 'MyGameLinux')
    }

    Logger.info('GameBinarySeeder Finish.')
  }

  private async processFiles(
    baseFolderPath: string,
    uploadBasePath: string,
    bucketNameBase: string,
  ): Promise<void> {
    const entries: string[] = await fs.readdir(baseFolderPath)

    for (const entry of entries) {
      const entryPath: string = path.join(baseFolderPath, entry)
      const stat = await fs.stat(entryPath)

      if (stat.isFile()) {
        try {
          const uploadPath: string = path.join(uploadBasePath, entry)
          await CloudStorageS3Service.uploadFileOrFolderInBucket({
            pathFilename: uploadPath,
            bucketName: bucketNameBase,
            localPath: entryPath,
          })
        } catch (error) {
          Logger.error(`Failed to upload ${entry}: ${error.message}`)
        }
      } else if (stat.isDirectory()) {
        const newUploadBasePath: string = path.join(uploadBasePath, entry)
        await this.processFiles(entryPath, newUploadBasePath, bucketNameBase)
      }
    }
  }

  private async processPlatform(
    game: Game,
    platformName: string,
    folderName: string,
  ): Promise<void> {
    const assetsBasePathGameBinary: string = path.resolve(
      'database/seeders/assets-bucket-s3/GameBinarySeeder/',
    )
    const bucketNameBase: string = 'crzgames-public'

    const platform: GamePlatform | null = await GamePlatform.findBy('name', platformName)
    if (!platform) {
      Logger.error(`${platformName} platform not found`)
      return
    }

    const sanitizedGameName: string = game.title.toLowerCase().replace(/\s+/g, '-')
    const binaryFolderPath: string = path.join(assetsBasePathGameBinary, folderName)

    try {
      await fs.access(binaryFolderPath)
    } catch {
      Logger.warn(`Binary folder not found for game: ${game.title} on ${platformName}, skipping...`)
      return
    }

    await this.processFiles(
      binaryFolderPath,
      `games/binaries/${sanitizedGameName}/${platformName.toLowerCase()}`,
      bucketNameBase,
    )

    const binaryFile: File = await CloudStorageS3Service.createFileInDB({
      pathFilename: `games/binaries/${sanitizedGameName}/${platformName.toLowerCase()}/`,
      bucketName: bucketNameBase,
      localPath: binaryFolderPath,
    })

    const gameBinary: GameBinary = new GameBinary()
    gameBinary.game_platforms_id = platform.id
    gameBinary.files_id = binaryFile.id
    await gameBinary.save()

    await game.related('gameBinary').attach([gameBinary.id])
  }
}
