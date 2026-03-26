import Game from '#models/game'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import BadRequestException from '#exceptions/bad_request_exception'
import type { BucketFileCommand } from '#services/cloud_storage_s3_service'
import CloudStorageS3Service from '#services/cloud_storage_s3_service'
import type File from '#models/file'
import GameConfiguration from '#models/game_configuration'
import GameMedia from '#models/game_media'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

/**
 * Type pour la méta-donnée de pagination
 * @type {object} PaginationMeta
 * @property {number} total - Nombre total de jeux
 * @property {number} from - Index du premier jeu de la page
 * @property {number} to - Index du dernier jeu de la page
 * @property {number} currentPage - Numéro de la page actuelle
 * @property {number} perPage - Nombre de jeux par page
 */
type PaginationMeta = {
  total: number
  from: number
  to: number
  currentPage: number
  perPage: number
}

/**
 * Type pour la réponse de la fonction getAllGames
 * @type {GamesResponse} GamesResponse
 * @property {Game[]} data - Liste des jeux
 * @property {PaginationMeta} meta - Méta-donnée de pagination
 */
export type GamesResponse =
  | Game[] // Si pas de pagination
  | { data: Game[]; meta: PaginationMeta } // Si pagination active

export type GameMode = 'solo' | 'multiplayer' | 'both'
export type PegiRating = 'PEGI 3' | 'PEGI 7' | 'PEGI 12' | 'PEGI 16' | 'PEGI 18'
export type GameMediaType = 'screenshot' | 'trailer' | 'gameplay'

export type GameConfigurationPayload = {
  cpuIntel: string
  cpuAmd: string
  gpuNvidia: string
  gpuAmd: string
  ram: string
  storage: string
  os: string
  internet?: boolean | null
  additionalNotes?: string | null
}

export type GameMediaPayload = {
  pathFilename: string
  bucketName: string
  type: GameMediaType
}

type GameBinaryPayload = {
  pathfilename: string
  platformId: number
  bucketName: string
}

export type CreateGamePayload = {
  title: string
  gameMode: GameMode
  publisher: string
  developer: string
  pegiRating: PegiRating
  releaseDate?: string | null
  upcomingGame: boolean
  newGame: boolean
  trailerPathFilename: string
  trailerBucketName: string
  picturePathFilename: string
  pictureBucketName: string
  logoPathFilename: string
  logoBucketName: string
  categoryIds: number[]
  platformIds: number[]
  languageIds: number[]
  description: string
  gameConfigurationsMinimal: GameConfigurationPayload
  gameConfigurationsRecommended: GameConfigurationPayload
  gameMedias?: GameMediaPayload[]
  binaries?: GameBinaryPayload[]
}

export type UpdateGamePayload = CreateGamePayload & {
  trailerFilesId: number
  logoFilesId: number
  pictureFileId: number
}

/**
 * Un service pour gérer les jeux.
 * Ce service fournit des méthodes pour créer, mettre à jour, supprimer et récupérer des jeux,
 * ainsi que pour récupérer des jeux par titre ou ID.
 * @class GamesService
 */
export default class GamesService {
  private static parseReleaseDate(releaseDate?: string | null): DateTime | null {
    if (!releaseDate) {
      return null
    }

    const parsedDate: DateTime = DateTime.fromISO(releaseDate)
    if (!parsedDate.isValid) {
      throw new BadRequestException('Invalid releaseDate. Expected ISO date format (YYYY-MM-DD)')
    }

    return parsedDate
  }

  private static async upsertGameConfiguration(
    configuration: GameConfigurationPayload,
    type: 'minimal' | 'recommended',
    configurationId?: number | null,
  ): Promise<number> {
    if (configurationId) {
      const existingConfiguration: GameConfiguration | null = await GameConfiguration.find(configurationId)
      if (existingConfiguration) {
        await existingConfiguration
          .merge({
            type,
            cpuIntel: configuration.cpuIntel,
            cpuAmd: configuration.cpuAmd,
            gpuNvidia: configuration.gpuNvidia,
            gpuAmd: configuration.gpuAmd,
            ram: configuration.ram,
            storage: configuration.storage,
            os: configuration.os,
            internet: configuration.internet ?? null,
            additionalNotes: configuration.additionalNotes ?? null,
          })
          .save()

        return existingConfiguration.id
      }
    }

    const createdConfiguration: GameConfiguration = await GameConfiguration.create({
      type,
      cpuIntel: configuration.cpuIntel,
      cpuAmd: configuration.cpuAmd,
      gpuNvidia: configuration.gpuNvidia,
      gpuAmd: configuration.gpuAmd,
      ram: configuration.ram,
      storage: configuration.storage,
      os: configuration.os,
      internet: configuration.internet ?? null,
      additionalNotes: configuration.additionalNotes ?? null,
    })

    return createdConfiguration.id
  }

  private static async syncGameMedias(gameId: number, medias?: GameMediaPayload[]): Promise<void> {
    if (!medias) {
      return
    }

    await GameMedia.query().where('gamesId', gameId).delete()

    for (const media of medias) {
      const mediaFile: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: media.pathFilename,
        bucketName: media.bucketName,
      })

      await GameMedia.create({
        gamesId: gameId,
        filesId: mediaFile.id,
        type: media.type,
      })
    }
  }

  // Fonction pour créer un nouveau game
  public static async createGames(payload: CreateGamePayload): Promise<Game> {
    try {
      const bucketFileTrailerCommand: BucketFileCommand = {
        pathFilename: payload.trailerPathFilename,
        bucketName: payload.trailerBucketName,
      }
      const bucketFilePictureCommand: BucketFileCommand = {
        pathFilename: payload.picturePathFilename,
        bucketName: payload.pictureBucketName,
      }
      const bucketFileLogoCommand: BucketFileCommand = {
        pathFilename: payload.logoPathFilename,
        bucketName: payload.logoBucketName,
      }

      const trailerFileInstance: File = await CloudStorageS3Service.createFileInDB(bucketFileTrailerCommand)
      const pictureFileInstance: File = await CloudStorageS3Service.createFileInDB(bucketFilePictureCommand)
      const logoFileInstance: File = await CloudStorageS3Service.createFileInDB(bucketFileLogoCommand)

      const gameConfigurationsMinimalId: number = await this.upsertGameConfiguration(
        payload.gameConfigurationsMinimal,
        'minimal',
      )
      const gameConfigurationsRecommendedId: number = await this.upsertGameConfiguration(
        payload.gameConfigurationsRecommended,
        'recommended',
      )

      const game: Game = await Game.create({
        title: payload.title,
        description: payload.description,
        gameMode: payload.gameMode,
        publisher: payload.publisher,
        developer: payload.developer,
        pegiRating: payload.pegiRating,
        releaseDate: this.parseReleaseDate(payload.releaseDate),
        upcomingGame: payload.upcomingGame,
        newGame: payload.newGame,
        gameConfigurationsMinimalId,
        gameConfigurationsRecommendedId,
        trailerFilesId: trailerFileInstance.id,
        pictureFilesId: pictureFileInstance.id,
        logoFilesId: logoFileInstance.id,
      })

      await this.syncGameMedias(game.id, payload.gameMedias)

      return game
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Fonction pour mettre à jour un game
  public static async updateGames(id: number, payload: UpdateGamePayload): Promise<Game> {
    try {
      const bucketFileTrailerCommand: BucketFileCommand = {
        pathFilename: payload.trailerPathFilename,
        bucketName: payload.trailerBucketName,
      }
      const bucketFilePictureCommand: BucketFileCommand = {
        pathFilename: payload.picturePathFilename,
        bucketName: payload.pictureBucketName,
      }
      const bucketFileLogoCommand: BucketFileCommand = {
        pathFilename: payload.logoPathFilename,
        bucketName: payload.logoBucketName,
      }

      await CloudStorageS3Service.updateFileInDB(bucketFileTrailerCommand, payload.trailerFilesId)
      await CloudStorageS3Service.updateFileInDB(bucketFilePictureCommand, payload.pictureFileId)
      await CloudStorageS3Service.updateFileInDB(bucketFileLogoCommand, payload.logoFilesId)

      // Updating in database
      const game: Game = await Game.findOrFail(id)
      const gameConfigurationsMinimalId: number = await this.upsertGameConfiguration(
        payload.gameConfigurationsMinimal,
        'minimal',
        game.gameConfigurationsMinimalId,
      )
      const gameConfigurationsRecommendedId: number = await this.upsertGameConfiguration(
        payload.gameConfigurationsRecommended,
        'recommended',
        game.gameConfigurationsRecommendedId,
      )

      const updatedGame: Game = await game
        .merge({
          title: payload.title,
          description: payload.description,
          gameMode: payload.gameMode,
          publisher: payload.publisher,
          developer: payload.developer,
          pegiRating: payload.pegiRating,
          releaseDate: this.parseReleaseDate(payload.releaseDate),
          upcomingGame: payload.upcomingGame,
          newGame: payload.newGame,
          gameConfigurationsMinimalId,
          gameConfigurationsRecommendedId,
        })
        .save()

      await this.syncGameMedias(updatedGame.id, payload.gameMedias)

      return updatedGame
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Fonction pour supprimer un game
  public static async deleteGames(id: number): Promise<void> {
    const game: Game = await Game.findOrFail(id)

    try {
      await game.delete()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // Fonction pour récupérer un game par son id
  public static async getGamesById(id: number): Promise<Game> {
    try {
      return await Game.query()
        .preload('pictureFile', (pictureFileQuery): void => {
          pictureFileQuery.preload('bucket')
        })
        .preload('logoFile', (logoFileQuery): void => {
          logoFileQuery.preload('bucket')
        })
        .preload('trailerFile', (trailerFile): void => {
          trailerFile.preload('bucket')
        })
        .preload('gamePlatform')
        .preload('gameBinary', (gameBinaryQuery): void => {
          gameBinaryQuery.preload('gamePlatform')
          gameBinaryQuery.preload('file', (fileQuery): void => {
            fileQuery.preload('bucket')
          })
        })
        .preload('gameCategory')
        .preload('gameConfigurationMinimal')
        .preload('gameConfigurationRecommended')
        .preload('languages')
        .preload('gameVersions')
        .preload('gameMedias', (gameMediasQuery): void => {
          gameMediasQuery.preload('file', (fileQuery): void => {
            fileQuery.preload('bucket')
          })
        })
        .where('id', id)
        .firstOrFail()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  /**
   * Récupérer tous les jeux avec pagination (ou non) et filtres par titre, genres, langues et modes de jeu
   * @param {string} title - Filtre par titre
   * @param {number} page - Numéro de la page
   * @param {number} perPage - Nombre de jeux par page
   * @param {string[]} genres - Liste des genres à filtrer
   * @param {string[]} languages - Liste des langues à filtrer
   * @param {string[]} gameModes - Liste des modes de jeu à filtrer (solo, multiplayer, both)
   * @param {boolean} [featuredGames] - Jeux en vedette (news ou à venir)
   * @param {string} [sortBy] - Option de tri ('releaseDate', 'titleAsc', 'titleDesc')
   * @returns {Promise<GamesResponse>}
   */
  public static async getAllGames(
    title?: string,
    page?: number,
    perPage?: number,
    genres?: string[],
    languages?: string[],
    gameModes?: string[],
    featuredGames?: boolean,
    sortBy: string = 'releaseDate',
  ): Promise<GamesResponse> {
    try {
      const applyGamePreloads = (
        queryBuilder: ModelQueryBuilderContract<typeof Game, Game>,
      ): ModelQueryBuilderContract<typeof Game, Game> =>
        queryBuilder
          .preload('pictureFile', (pictureFileQuery): void => {
            pictureFileQuery.preload('bucket')
          })
          .preload('logoFile', (logoFileQuery): void => {
            logoFileQuery.preload('bucket')
          })
          .preload('trailerFile', (trailerFile): void => {
            trailerFile.preload('bucket')
          })
          .preload('gamePlatform')
          .preload('gameBinary', (gameBinaryQuery): void => {
            gameBinaryQuery.preload('gamePlatform')
            gameBinaryQuery.preload('file', (fileQuery): void => {
              fileQuery.preload('bucket')
            })
          })
          .preload('gameCategory')
          .preload('gameConfigurationMinimal')
          .preload('gameConfigurationRecommended')
          .preload('languages')
          .preload('gameVersions')
          .preload('gameMedias', (gameMediasQuery): void => {
            gameMediasQuery.preload('file', (fileQuery): void => {
              fileQuery.preload('bucket')
            })
          })

      const query: ModelQueryBuilderContract<typeof Game, Game> = Game.query()

      // Filtre par titre
      if (title) {
        query.whereRaw('LOWER(title) LIKE ?', [`%${title.toLowerCase()}%`])
      }

      // Filtre par jeux en vedette (news ou à venir)
      if (featuredGames) {
        query.where('newGame', true).orWhere('upcomingGame', true)
      }

      // Filtre par genres
      if (genres && genres.length > 0) {
        query.whereHas('gameCategory', (categoryQuery) => {
          categoryQuery.whereIn('name', genres)
        })
      }

      // Filtre par langues
      if (languages && languages.length > 0) {
        query.whereHas('languages', (languageQuery) => {
          languageQuery.whereIn('name', languages)
        })
      }

      // Filtre par modes de jeu
      if (gameModes && gameModes.length > 0) {
        let allowedModes = [...gameModes]
        if (gameModes.includes('solo') || gameModes.includes('multiplayer')) {
          allowedModes.push('both')
        }
        allowedModes = [...new Set(allowedModes)]
        query.whereIn('gameMode', allowedModes)
      }

      // Appliquer le tri
      switch (sortBy) {
        case 'releaseDate':
          query.orderBy('releaseDate', 'desc') // Plus récent au plus ancien
          break
        case 'titleAsc':
          // Tri A-Z avec gestion des nombres
          query.orderByRaw(`
            REGEXP_REPLACE(title, '[0-9]+$', '') ASC,
            CAST(REGEXP_REPLACE(title, '.*[^0-9]', '') AS UNSIGNED) ASC
          `)
          break
        case 'titleDesc':
          // Tri Z-A avec gestion des nombres
          query.orderByRaw(`
            REGEXP_REPLACE(title, '[0-9]+$', '') DESC,
            CAST(REGEXP_REPLACE(title, '.*[^0-9]', '') AS UNSIGNED) DESC
          `)
          break
        default:
          query.orderBy('releaseDate', 'desc') // Par défaut
      }

      // Si la pagination n'est pas demandée, on renvoie simplement les jeux
      if (!page || !perPage) {
        return await applyGamePreloads(query).exec()
      }

      // Pagination activée : on récupère le total des jeux
      const total: number = Number(
        await query
          .clone()
          .count('* as total')
          .then((games: Game[]): any => games[0].$extras.total),
      )
      const from: number = (page - 1) * perPage + 1
      const to: number = Math.min(from + perPage - 1, total)

      // Récupérer les jeux avec pagination
      const games: Game[] = await applyGamePreloads(query.clone()).forPage(page, perPage).exec()

      return {
        data: games,
        meta: {
          total,
          from,
          to,
          currentPage: page,
          perPage,
        },
      } as GamesResponse
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  //fonction filtre games par title sans sensitive case
  public static async getAllGamesByTitle(title: string): Promise<Game[]> {
    try {
      const games: Game[] = await Game.query().whereRaw('LOWER(title) LIKE ?', [`%${title.toLowerCase()}%`])

      if (!games || games.length === 0) {
        throw new NotFoundException('No games found')
      }

      return games
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  public static async getGameByTitle(title: string): Promise<Game> {
    try {
      return await Game.query()
        .where('title', title)
        .preload('pictureFile', (pictureFileQuery): void => {
          pictureFileQuery.preload('bucket')
        })
        .preload('logoFile', (logoFileQuery): void => {
          logoFileQuery.preload('bucket')
        })
        .preload('trailerFile', (trailerFile): void => {
          trailerFile.preload('bucket')
        })
        .preload('gamePlatform')
        .preload('gameBinary', (gameBinaryQuery): void => {
          gameBinaryQuery.preload('gamePlatform')
          gameBinaryQuery.preload('file', (fileQuery): void => {
            fileQuery.preload('bucket')
          })
        })
        .preload('gameCategory')
        .preload('gameConfigurationMinimal')
        .preload('gameConfigurationRecommended')
        .preload('languages')
        .preload('gameVersions')
        .preload('gameMedias', (gameMediasQuery): void => {
          gameMediasQuery.preload('file', (fileQuery): void => {
            fileQuery.preload('bucket')
          })
        })
        .firstOrFail()
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
