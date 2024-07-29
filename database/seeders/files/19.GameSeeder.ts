import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Game from 'App/Models/Game'
import File from 'App/Models/File'
import path from 'path'
import CloudStorageS3Service from 'App/Services/CloudStorageS3Service'
import Logger from '@ioc:Adonis/Core/Logger'
import GamePlatform from 'App/Models/GamePlatform'
import GameCategory from 'App/Models/GameCategory'

/*
  LE GAMESEEDER fait pour GameBinaryAssignment, GamePlateformAssignment, GameCategoryAssignment, Game, GameBinary
*/
export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    const assetsBasePath: string = path.resolve('database/seeders/assets-bucket-s3/GameSeeder/')
    const bucketNameBase: string = 'crzgames-public'

    Logger.info('GameSeeder : ')

    const fakeGames = [
      {
        title: 'World of Warcraft',
        upcoming_game: false,
        new_game: true,
        pictureFile: path.join(assetsBasePath, 'wow-picture.webp'),
        trailerFile: path.join(assetsBasePath, 'wow-trailer.webm'),
        logoFile: path.join(assetsBasePath, 'wow-logo.webp'),
        gamePlatforms: [
          'Windows',
          'macOS',
          'Linux',
          'Microsoft Store',
          'Nintendo Switch',
          'PlayStation®5',
          'PlayStation®4',
          'Xbox One',
          'Xbox Series X|S',
          'iOS',
          'Android',
          'HTML5',
          'Steam',
        ],
        gameCategories: ['MMORPG'],
      },
      {
        title: 'Diablo IV',
        upcoming_game: true,
        new_game: false,
        pictureFile: path.join(assetsBasePath, 'diablo4-picture.webp'),
        trailerFile: path.join(assetsBasePath, 'diablo4-trailer.webm'),
        logoFile: path.join(assetsBasePath, 'diablo4-logo.webp'),
        gamePlatforms: [
          'iOS',
          'Android',
          'Windows',
          'macOS',
          'Linux',
        ],
        gameCategories: ['Action'],
      },
      {
        title: 'Grand Theft Auto V',
        upcoming_game: false,
        new_game: false,
        pictureFile: path.join(assetsBasePath, 'gtav-picture.jpg'),
        trailerFile: path.join(assetsBasePath, 'gtav-trailer.mp4'),
        logoFile: path.join(assetsBasePath, 'diablo4-logo.webp'),
        gamePlatforms: ['Windows', 'macOS', 'Linux', 'Microsoft Store', 'Steam'],
        gameCategories: ['Fantasy'],
      },
    ]

    for (const gameData of fakeGames) {
      const sanitizedGameName: string = gameData.title.toLowerCase().replace(/\s+/g, '-')
      const pictureFileExtension: string = path.extname(gameData.pictureFile)
      const trailerFileExtension: string = path.extname(gameData.trailerFile)
      const logoFileExtension: string = path.extname(gameData.logoFile)

      // Insére assets in bucket s3
      await CloudStorageS3Service.uploadFileOrFolderInBucket({
        pathFilename: 'games/pictures/picture-' + sanitizedGameName + pictureFileExtension,
        bucketName: bucketNameBase,
        localPath: gameData.pictureFile,
      })

      await CloudStorageS3Service.uploadFileOrFolderInBucket({
        pathFilename: 'games/trailers/trailer-' + sanitizedGameName + trailerFileExtension,
        bucketName: bucketNameBase,
        localPath: gameData.trailerFile,
      })
      await CloudStorageS3Service.uploadFileOrFolderInBucket({
        pathFilename: 'games/logos/logo-' + sanitizedGameName + logoFileExtension,
        bucketName: bucketNameBase,
        localPath: gameData.logoFile,
      })

      // Associe les fichier du bucket s3 au model File in database
      const pictureFile: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: 'games/pictures/picture-' + sanitizedGameName + pictureFileExtension,
        bucketName: bucketNameBase,
        localPath: gameData.pictureFile,
      })

      const trailerFile: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: 'games/trailers/trailer-' + sanitizedGameName + trailerFileExtension,
        bucketName: bucketNameBase,
        localPath: gameData.trailerFile,
      })

      const logoFile: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: 'games/logos/logo-' + sanitizedGameName + logoFileExtension,
        bucketName: bucketNameBase,
        localPath: gameData.logoFile,
      })

      // Create Game
      const game: Game = await Game.create({
        upcoming_game: gameData.upcoming_game,
        new_game: gameData.new_game,
        title: gameData.title,
        description: 'my description game',
        trailer_files_id: trailerFile.id,
        picture_files_id: pictureFile.id,
        logo_files_id: logoFile.id,
      })

      // Associate platforms with the game
      for (const platformName of gameData.gamePlatforms) {
        const platform: GamePlatform | null = await GamePlatform.findByOrFail('name', platformName)
        if (platform) {
          await game.related('gamePlatform').attach([platform.id])
        }
      }

      // Associate categories with the game
      for (const categoryName of gameData.gameCategories) {
        const category: GameCategory | null = await GameCategory.findByOrFail('name', categoryName)
        if (category) {
          await game.related('gameCategory').attach([category.id])
        }
      }
    }

    Logger.info('GameSeeder Finish.')
  }
}
