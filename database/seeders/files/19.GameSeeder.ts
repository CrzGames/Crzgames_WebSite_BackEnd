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
 * @property {string} - cpu_intel
 * @property {string} - cpu_amd
 * @property {string} - gpu_nvidia
 * @property {string} - gpu_amd
 * @property {string} - ram
 * @property {string} - storage
 * @property {string} - os
 * @property {boolean} - internet
 * @property {string} - additional_notes
 */
type FakeGameConfiguration = {
  cpu_intel: string
  cpu_amd: string
  gpu_nvidia: string
  gpu_amd: string
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
 * @property {'PEGI 3' | 'PEGI 7' | 'PEGI 12' | 'PEGI 16' | 'PEGI 18'} - pegi_rating
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
  pegi_rating: 'PEGI 3' | 'PEGI 7' | 'PEGI 12' | 'PEGI 16' | 'PEGI 18'
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
        gamePlatforms: ['Windows', 'macOS', 'Linux', 'Steam'],
        gameCategories: ['MMORPG'],
        release_date: '2025-03-09',
        game_mode: 'both',
        publisher: 'Blizzard Entertainment',
        developer: 'Blizzard Entertainment',
        minimal_config: {
          cpu_intel: 'Intel Core i3-9100',
          cpu_amd: 'AMD Ryzen 3 1200',
          gpu_nvidia: 'NVIDIA GeForce GTX 1050',
          gpu_amd: 'AMD Radeon RX 560',
          ram: '8 GB RAM',
          storage: '50 GB',
          os: 'Windows 10+',
          internet: true,
          additional_notes: 'Requires an internet connection',
        },
        recommended_config: {
          cpu_intel: 'Intel Core i5-9400',
          cpu_amd: 'AMD Ryzen 5 2600',
          gpu_nvidia: 'NVIDIA GeForce GTX 1660',
          gpu_amd: 'AMD Radeon RX 570',
          ram: '16 GB RAM',
          storage: '50 GB',
          os: 'Windows 10+',
          internet: true,
          additional_notes: 'Requires an internet connection',
        },
        languages: ['English', 'French'],
        pegi_rating: 'PEGI 12',
      },
      {
        title: 'Diablo IV',
        upcoming_game: true,
        new_game: false,
        pictureFile: path.join(assetsBasePath, 'diablo4-picture.webp'),
        trailerFile: path.join(assetsBasePath, 'diablo4-trailer.webm'),
        logoFile: path.join(assetsBasePath, 'diablo4-logo.webp'),
        gamePlatforms: ['Windows', 'macOS', 'Linux'],
        gameCategories: ['Mystery'],
        release_date: '2025-04-15',
        game_mode: 'solo',
        publisher: 'Blizzard Entertainment',
        developer: 'Blizzard Entertainment',
        minimal_config: {
          cpu_intel: 'Intel i3',
          cpu_amd: 'AMD Ryzen 3',
          gpu_nvidia: 'GTX 1050',
          gpu_amd: 'RX 560',
          ram: '8GB',
          storage: '40GB',
          os: 'Windows 10+',
          internet: true,
          additional_notes: 'Requires an internet connection',
        },
        recommended_config: {
          cpu_intel: 'Intel i5',
          cpu_amd: 'AMD Ryzen 5',
          gpu_nvidia: 'GTX 1660',
          gpu_amd: 'RX 570',
          ram: '16GB',
          storage: '40GB',
          os: 'Windows 10+',
          internet: true,
          additional_notes: 'Requires an internet connection',
        },
        languages: ['English'],
        pegi_rating: 'PEGI 16',
      },
      {
        title: 'Grand Theft Auto V',
        upcoming_game: false,
        new_game: false,
        pictureFile: path.join(assetsBasePath, 'gtav-picture.jpg'),
        trailerFile: path.join(assetsBasePath, 'gtav-trailer.mp4'),
        logoFile: path.join(assetsBasePath, 'diablo4-logo.webp'),
        gamePlatforms: ['Windows', 'macOS', 'Steam'],
        gameCategories: ['Adventure'],
        release_date: '2025-02-20',
        game_mode: 'multiplayer',
        publisher: 'Rockstar Games',
        developer: 'Rockstar North',
        minimal_config: {
          cpu_intel: 'Intel Core 2 Quad CPU Q6600',
          cpu_amd: 'AMD Phenom 9850 Quad-Core Processor',
          gpu_nvidia: 'NVIDIA 9800 GT 1GB',
          gpu_amd: 'AMD HD 4870 1GB',
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
        pegi_rating: 'PEGI 18',
      },
    ]

    // Ajout de 10 jeux supplémentaires pour tester le scroll et les placements
    for (let i = 1; i <= 30; i++) {
      fakeGames.push({
        title: `Test Game ${i}`,
        upcoming_game: i % 2 === 0,
        new_game: i % 3 === 0,
        pictureFile: path.join(assetsBasePath, 'wow-picture.webp'),
        trailerFile: path.join(assetsBasePath, 'wow-trailer.webm'),
        logoFile: path.join(assetsBasePath, 'wow-logo.webp'),
        gamePlatforms: ['Windows', 'Steam'],
        gameCategories: ['Action'],
        release_date: `2025-03-${i < 10 ? '0' + i : i}`,
        game_mode: 'both',
        publisher: `Indie Studio ${i}`,
        developer: `Indie Dev Team ${i}`,
        minimal_config: {
          cpu_intel: 'Intel i3',
          cpu_amd: 'AMD Ryzen 3',
          gpu_nvidia: 'GTX 1050',
          gpu_amd: 'RX 560',
          ram: '4GB',
          storage: '20GB',
          os: 'Windows 10+',
          internet: i % 2 === 0,
          additional_notes: 'Lightweight game, runs on most machines',
        },
        recommended_config: {
          cpu_intel: 'Intel i5',
          cpu_amd: 'AMD Ryzen 5',
          gpu_nvidia: 'GTX 1660',
          gpu_amd: 'RX 570',
          ram: '8GB',
          storage: '30GB',
          os: 'Windows 10+',
          internet: true,
          additional_notes: 'Better performance with a dedicated GPU',
        },
        languages: ['English', 'French'],
        pegi_rating: 'PEGI 12',
      })
    }

    for (const fakeGame of fakeGames) {
      try {
        const sanitizedGameName: string = fakeGame.title.toLowerCase().replace(/\s+/g, '-')
        const pictureFileExtension: string = path.extname(fakeGame.pictureFile)
        const trailerFileExtension: string = path.extname(fakeGame.trailerFile)
        const logoFileExtension: string = path.extname(fakeGame.logoFile)

        // ✅ 0. Insére les assets dans le bucket s3 (images, vidéos, logos)
        await CloudStorageS3Service.uploadFileOrFolderInBucket({
          pathFilename: `games/pictures/picture-${sanitizedGameName}${pictureFileExtension}`,
          bucketName: bucketNameBase,
          localPath: fakeGame.pictureFile,
        })

        await CloudStorageS3Service.uploadFileOrFolderInBucket({
          pathFilename: `games/trailers/trailer-${sanitizedGameName}${trailerFileExtension}`,
          bucketName: bucketNameBase,
          localPath: fakeGame.trailerFile,
        })

        await CloudStorageS3Service.uploadFileOrFolderInBucket({
          pathFilename: `games/logos/logo-${sanitizedGameName}${logoFileExtension}`,
          bucketName: bucketNameBase,
          localPath: fakeGame.logoFile,
        })

        // ✅ 1. Création des "File" dans la db (images, vidéos, logos)
        let pictureFile: File, trailerFile: File, logoFile: File

        try {
          pictureFile = await CloudStorageS3Service.createFileInDB({
            pathFilename: `games/pictures/picture-${sanitizedGameName}${pictureFileExtension}`,
            bucketName: bucketNameBase,
            localPath: fakeGame.pictureFile,
          })
        } catch (err) {
          Logger.error(`Error uploading pictureFile for ${fakeGame.title}:` + err)
          continue
        }

        try {
          trailerFile = await CloudStorageS3Service.createFileInDB({
            pathFilename: `games/trailers/trailer-${sanitizedGameName}${trailerFileExtension}`,
            bucketName: bucketNameBase,
            localPath: fakeGame.trailerFile,
          })
        } catch (err) {
          Logger.error(`Error uploading trailerFile for ${fakeGame.title}:` + err)
          continue
        }

        try {
          logoFile = await CloudStorageS3Service.createFileInDB({
            pathFilename: `games/logos/logo-${sanitizedGameName}${logoFileExtension}`,
            bucketName: bucketNameBase,
            localPath: fakeGame.logoFile,
          })
        } catch (err) {
          Logger.error(`Error uploading logoFile for ${fakeGame.title}:` + err)
          continue
        }

        // ✅ 1.5 Création des configurations
        let gameConfigurationMinimal: GameConfiguration,
          gameConfigurationRecommended: GameConfiguration
        try {
          gameConfigurationMinimal = await GameConfiguration.create({
            cpu_intel: fakeGame.minimal_config.cpu_intel,
            cpu_amd: fakeGame.minimal_config.cpu_amd,
            gpu_nvidia: fakeGame.minimal_config.gpu_nvidia,
            gpu_amd: fakeGame.minimal_config.gpu_amd,
            ram: fakeGame.minimal_config.ram,
            storage: fakeGame.minimal_config.storage,
            os: fakeGame.minimal_config.os,
            internet: fakeGame.minimal_config.internet,
            additional_notes: fakeGame.minimal_config.additional_notes,
          })

          gameConfigurationRecommended = await GameConfiguration.create({
            cpu_intel: fakeGame.recommended_config.cpu_intel,
            cpu_amd: fakeGame.recommended_config.cpu_amd,
            gpu_nvidia: fakeGame.recommended_config.gpu_nvidia,
            gpu_amd: fakeGame.recommended_config.gpu_amd,
            ram: fakeGame.recommended_config.ram,
            storage: fakeGame.recommended_config.storage,
            os: fakeGame.recommended_config.os,
            internet: fakeGame.recommended_config.internet,
            additional_notes: fakeGame.recommended_config.additional_notes,
          })
        } catch (err) {
          Logger.error(`Error creating minimalConfig for ${fakeGame.title}:` + err)
          continue
        }

        // ✅ 2. Création du jeu
        let game: Game
        try {
          game = await Game.create({
            upcoming_game: fakeGame.upcoming_game,
            new_game: fakeGame.new_game,
            title: fakeGame.title,
            description: 'Generated test game',
            trailer_files_id: trailerFile.id,
            picture_files_id: pictureFile.id,
            logo_files_id: logoFile.id,
            release_date: DateTime.fromISO(fakeGame.release_date),
            game_mode: fakeGame.game_mode,
            publisher: fakeGame.publisher,
            developer: fakeGame.developer,
            game_configurations_minimal_id: gameConfigurationMinimal.id,
            game_configurations_recommended_id: gameConfigurationRecommended.id,
          })
        } catch (err) {
          Logger.error(`Error creating game ${fakeGame.title}:` + err)
          continue
        }

        // ✅ 3. Ajout des plateformes
        for (const platformName of fakeGame.gamePlatforms) {
          try {
            const platform: GamePlatform | null = await GamePlatform.findBy('name', platformName)
            if (!platform) {
              Logger.warn(`GamePlatform "${platformName}" not found for ${fakeGame.title}!`)
              continue
            }
            await game.related('gamePlatform').attach([platform.id])
          } catch (err) {
            Logger.error(`Error attaching platform ${platformName} to ${fakeGame.title}:` + err)
          }
        }

        // ✅ 4. Ajout des catégories
        for (const categoryName of fakeGame.gameCategories) {
          try {
            const category: GameCategory | null = await GameCategory.findBy('name', categoryName)
            if (!category) {
              Logger.warn(`GameCategory "${categoryName}" not found for ${fakeGame.title}!`)
              continue
            }
            await game.related('gameCategory').attach([category.id])
          } catch (err) {
            Logger.error(`Error attaching category ${categoryName} to ${fakeGame.title}:` + err)
          }
        }

        // ✅ 5. Ajout des langues
        for (const languageName of fakeGame.languages) {
          try {
            const language: Language | null = await Language.findBy('name', languageName)
            if (!language) {
              Logger.warn(`Language "${languageName}" not found for ${fakeGame.title}!`)
              continue
            }
            await game.related('languages').attach([language.id])
          } catch (err) {
            Logger.error(`Error attaching language ${languageName} to ${fakeGame.title}:` + err)
          }
        }

        Logger.info(`GameSeeder: Successfully added ${fakeGame.title}`)
      } catch (err) {
        Logger.error(`Unexpected error in GameSeeder for ${fakeGame.title}:` + err)
      }
    }

    Logger.info('GameSeeder Finish.')
  }
}
