import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Game from 'App/Models/Game'
import File from 'App/Models/File'
import GamePlatform from 'App/Models/GamePlatform'
import GameCategory from 'App/Models/GameCategory'
import GameConfiguration from 'App/Models/GameConfiguration'
import Language from 'App/Models/Language'
import path from 'path'
import CloudStorageS3Service from 'App/Services/CloudStorageS3Service'
import Logger from '@ioc:Adonis/Core/Logger'
import { DateTime } from 'luxon'

/* TYPES */
/**
 * @type {object} FakeGameConfiguration
 * @property {string} - cpu
 * @property {string} - gpu
 * @property {string} - ram
 * @property {string} - storage
 * @property {string} - os
 * @property {boolean} - internet
 * @property {string} - additional_notes
 */
type FakeGameConfiguration = {
  cpu: string
  gpu: string
  ram: string
  storage: string
  os: string
  internet: boolean
  additional_notes: string
}

/**
 * @type {object} FakeGame
 * @property {string} - title
 * @property {boolean} - upcoming_game
 * @property {boolean} - new_game
 * @property {string} - pictureFile
 * @property {string} - trailerFile
 * @property {string} - logoFile
 * @property {string[]} - gamePlatforms
 * @property {string[]} - gameCategories
 * @property {string} - release_date
 * @property {'solo' | 'multiplayer' | 'both'} - game_mode
 * @property {string} - publisher
 * @property {string} - developer
 * @property {GameConfigurationFake} - minimal_config
 * @property {GameConfigurationFake} - recommended_config
 * @property {string[]} - languages
 */
type FakeGame = {
  title: string
  upcoming_game: boolean
  new_game: boolean
  pictureFile: string
  trailerFile: string
  logoFile: string
  gamePlatforms: string[]
  gameCategories: string[]
  release_date: string
  game_mode: 'solo' | 'multiplayer' | 'both'
  publisher: string
  developer: string
  minimal_config: FakeGameConfiguration
  recommended_config: FakeGameConfiguration
  languages: string[]
}

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    const assetsBasePath: string = path.resolve('database/seeders/assets-bucket-s3/GameSeeder/')
    const bucketNameBase: string = 'crzgames-public'

    Logger.info('GameSeeder Start : ')

    const fakeGames: FakeGame[] = [
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
        release_date: '2025-03-09',
        game_mode: 'both',
        publisher: 'Blizzard Entertainment',
        developer: 'Blizzard Entertainment',
        minimal_config: {
          cpu: 'Intel i5',
          gpu: 'GTX 1050',
          ram: '8GB',
          storage: '50GB',
          os: 'Windows 10+',
          internet: true,
          additional_notes: 'Requires an internet connection',
        },
        recommended_config: {
          cpu: 'Intel i7',
          gpu: 'GTX 1660',
          ram: '16GB',
          storage: '50GB',
          os: 'Windows 10+',
          internet: true,
          additional_notes: 'Requires an internet connection',
        },
        languages: ['English', 'French'],
      },
      {
        title: 'Diablo IV',
        upcoming_game: true,
        new_game: false,
        pictureFile: path.join(assetsBasePath, 'diablo4-picture.webp'),
        trailerFile: path.join(assetsBasePath, 'diablo4-trailer.webm'),
        logoFile: path.join(assetsBasePath, 'diablo4-logo.webp'),
        gamePlatforms: ['iOS', 'Android', 'Windows', 'macOS', 'Linux'],
        gameCategories: ['Action'],
        release_date: '2025-04-15',
        game_mode: 'solo',
        publisher: 'Blizzard Entertainment',
        developer: 'Blizzard Entertainment',
        minimal_config: {
          cpu: 'Intel i5',
          gpu: 'GTX 1050',
          ram: '8GB',
          storage: '40GB',
          os: 'Windows 10+ / macOS 10.15+ / Ubuntu 20.04+',
          internet: true,
          additional_notes: 'Requires an internet connection',
        },
        recommended_config: {
          cpu: 'Intel i7',
          gpu: 'GTX 1660',
          ram: '16GB',
          storage: '40GB',
          os: 'Windows 10+ / macOS 10.15+ / Ubuntu 20.04+',
          internet: true,
          additional_notes: 'Requires an internet connection',
        },
        languages: ['English'],
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
        release_date: '2025-02-20',
        game_mode: 'multiplayer',
        publisher: 'Rockstar Games',
        developer: 'Rockstar North',
        minimal_config: {
          cpu: 'Intel i5',
          gpu: 'GTX 1050',
          ram: '8GB',
          storage: '60GB',
          os: 'Windows 10+',
          internet: false,
          additional_notes: 'Requires a decent GPU',
        },
        recommended_config: {
          cpu: 'Intel i7',
          gpu: 'GTX 1660',
          ram: '16GB',
          storage: '60GB',
          os: 'Windows 10+',
          internet: false,
          additional_notes: 'For best visual quality',
        },
        languages: ['English', 'Spanish'],
      },
    ]

    for (const fakeGame of fakeGames) {
      const sanitizedGameName: string = fakeGame.title.toLowerCase().replace(/\s+/g, '-')
      const pictureFileExtension: string = path.extname(fakeGame.pictureFile)
      const trailerFileExtension: string = path.extname(fakeGame.trailerFile)
      const logoFileExtension: string = path.extname(fakeGame.logoFile)

      // Insére les assets dans le bucket s3
      await CloudStorageS3Service.uploadFileOrFolderInBucket({
        pathFilename: 'games/pictures/picture-' + sanitizedGameName + pictureFileExtension,
        bucketName: bucketNameBase,
        localPath: fakeGame.pictureFile,
      })

      await CloudStorageS3Service.uploadFileOrFolderInBucket({
        pathFilename: 'games/trailers/trailer-' + sanitizedGameName + trailerFileExtension,
        bucketName: bucketNameBase,
        localPath: fakeGame.trailerFile,
      })

      await CloudStorageS3Service.uploadFileOrFolderInBucket({
        pathFilename: 'games/logos/logo-' + sanitizedGameName + logoFileExtension,
        bucketName: bucketNameBase,
        localPath: fakeGame.logoFile,
      })

      // Associe les fichier du bucket s3 au picture, trailer et logo
      const pictureFile: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: 'games/pictures/picture-' + sanitizedGameName + pictureFileExtension,
        bucketName: bucketNameBase,
        localPath: fakeGame.pictureFile,
      })

      const trailerFile: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: 'games/trailers/trailer-' + sanitizedGameName + trailerFileExtension,
        bucketName: bucketNameBase,
        localPath: fakeGame.trailerFile,
      })

      const logoFile: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: 'games/logos/logo-' + sanitizedGameName + logoFileExtension,
        bucketName: bucketNameBase,
        localPath: fakeGame.logoFile,
      })

      // Create les configurations du jeu (minimal et recommended)
      const gameConfigurationMinimal: GameConfiguration = await GameConfiguration.create({
        type: 'minimal',
        cpu: fakeGame.minimal_config.cpu,
        gpu: fakeGame.minimal_config.gpu,
        ram: fakeGame.minimal_config.ram,
        storage: fakeGame.minimal_config.storage,
        os: fakeGame.minimal_config.os,
        internet: fakeGame.minimal_config.internet,
        additional_notes: fakeGame.minimal_config.additional_notes,
      })

      const gameConfigurationRecommended: GameConfiguration = await GameConfiguration.create({
        type: 'recommended',
        cpu: fakeGame.recommended_config.cpu,
        gpu: fakeGame.recommended_config.gpu,
        ram: fakeGame.recommended_config.ram,
        storage: fakeGame.recommended_config.storage,
        os: fakeGame.recommended_config.os,
        internet: fakeGame.recommended_config.internet,
        additional_notes: fakeGame.recommended_config.additional_notes,
      })

      // Créer le jeu
      const game: Game = await Game.create({
        upcoming_game: fakeGame.upcoming_game,
        new_game: fakeGame.new_game,
        title: fakeGame.title,
        description: 'my description game',
        trailer_files_id: trailerFile.id,
        picture_files_id: pictureFile.id,
        logo_files_id: logoFile.id,
        release_date: DateTime.fromISO(fakeGame.release_date),
        game_mode: fakeGame.game_mode as 'solo' | 'multiplayer' | 'both',
        publisher: fakeGame.publisher,
        developer: fakeGame.developer,
        game_configurations_minimal_id: gameConfigurationMinimal.id,
        game_configurations_recommended_id: gameConfigurationRecommended.id,
      })

      // Associe les plateformes au jeu
      for (const platformName of fakeGame.gamePlatforms) {
        const platform: GamePlatform = await GamePlatform.findByOrFail('name', platformName)
        await game.related('gamePlatform').attach([platform.id])
      }

      // Associe les catégories au jeu
      for (const categoryName of fakeGame.gameCategories) {
        const category: GameCategory = await GameCategory.findByOrFail('name', categoryName)
        await game.related('gameCategory').attach([category.id])
      }

      // Associe les langues au jeu
      for (const languageName of fakeGame.languages) {
        const language: Language = await Language.findByOrFail('name', languageName)
        await game.related('languages').attach([language.id])
      }
    }

    Logger.info('GameSeeder Finish.')
  }
}
