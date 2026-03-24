import { BaseSeeder } from '@adonisjs/lucid/seeders'
import path from 'path'
import fs from 'fs/promises'
import Game from '#models/game'
import GameBinary from '#models/game_binary'
import GamePlatform from '#models/game_platform'
import File from '#models/file'
import CloudStorageS3Service from '#services/cloud_storage_s3_service'
import logger from '@adonisjs/core/services/logger'

export default class GameBinarySeeder extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    logger.info('GameBinarySeeder Start.')

    const games: Game[] = await Game.all()
    for (const game of games) {
      await this.processPlatform(game, 'Windows', 'MyGameWindows')
      await this.processPlatform(game, 'macOS', 'MyGameMacOS')
      await this.processPlatform(game, 'Linux', 'MyGameLinux')
    }

    logger.info('GameBinarySeeder Finish.')
  }

  private async processFiles(baseFolderPath: string, uploadBasePath: string, bucketNameBase: string): Promise<void> {
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
          logger.error(`Failed to upload ${entry}: ${error.message}`)
        }
      } else if (stat.isDirectory()) {
        const newUploadBasePath: string = path.join(uploadBasePath, entry)
        await this.processFiles(entryPath, newUploadBasePath, bucketNameBase)
      }
    }
  }

  private async processPlatform(game: Game, platformName: string, folderName: string): Promise<void> {
    const assetsBasePathGameBinary: string = path.resolve('database/seeders/assets-bucket-s3/GameBinarySeeder/')
    const bucketNameBase: string = 'crzgames-public'

    const platform: GamePlatform | null = await GamePlatform.findBy('name', platformName)
    if (!platform) {
      logger.error(`${platformName} platform not found`)
      return
    }

    const sanitizedGameName: string = game.title.toLowerCase().replace(/\s+/g, '-')
    const binaryFolderPath: string = path.join(assetsBasePathGameBinary, folderName)

    try {
      await fs.access(binaryFolderPath)
    } catch {
      logger.warn(`Binary folder not found for game: ${game.title} on ${platformName}, skipping...`)
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
    gameBinary.gamePlatformsId = platform.id
    gameBinary.filesId = binaryFile.id
    await gameBinary.save()

    await game.related('gameBinary').attach([gameBinary.id])
  }
}
