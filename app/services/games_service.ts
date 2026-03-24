import Game from '#models/game'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import BadRequestException from '#exceptions/bad_request_exception'
import type { BucketFileCommand } from '#services/cloud_storage_s3_service'
import CloudStorageS3Service from '#services/cloud_storage_s3_service'
import type File from '#models/file'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { errors as lucidErrors } from '@adonisjs/lucid'

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

/**
 * Un service pour gérer les jeux.
 * Ce service fournit des méthodes pour créer, mettre à jour, supprimer et récupérer des jeux,
 * ainsi que pour récupérer des jeux par titre ou ID.
 * @class GamesService
 */
export default class GamesService {
  // Fonction pour créer un nouveau game
  public static async createGames(
    title: string,
    upcomingGame: boolean,
    newGame: boolean,
    trailerPathFilename: string,
    trailerBucketName: string,
    picturePathFilename: string,
    pictureBucketName: string,
    logoPathFilename: string,
    logoBucketName: string,
    description: string,
  ): Promise<Game> {
    try {
      const bucketFileTrailerCommand: BucketFileCommand = {
        pathFilename: trailerPathFilename,
        bucketName: trailerBucketName,
      }
      const bucketFilePictureCommand: BucketFileCommand = {
        pathFilename: picturePathFilename,
        bucketName: pictureBucketName,
      }
      const bucketFileLogoCommand: BucketFileCommand = {
        pathFilename: logoPathFilename,
        bucketName: logoBucketName,
      }

      const trailerFileInstance: File = await CloudStorageS3Service.createFileInDB(bucketFileTrailerCommand)
      const pictureFileInstance: File = await CloudStorageS3Service.createFileInDB(bucketFilePictureCommand)
      const logoFileInstance: File = await CloudStorageS3Service.createFileInDB(bucketFileLogoCommand)

      return await Game.create({
        title,
        description,
        upcomingGame: upcomingGame,
        newGame: newGame,
        trailerFilesId: trailerFileInstance.id,
        pictureFilesId: pictureFileInstance.id,
        logoFilesId: logoFileInstance.id,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Fonction pour mettre à jour un game
  public static async updateGames(
    id: number,
    title: string,
    upcomingGame: boolean,
    newGame: boolean,
    trailerPathFilename: string,
    trailerBucketName: string,
    picturePathFilename: string,
    pictureBucketName: string,
    logoPathFilename: string,
    logoBucketName: string,
    trailer_files_id: number,
    logo_files_id: number,
    picture_files_id: number,
    description: string,
  ): Promise<Game> {
    try {
      const bucketFileTrailerCommand: BucketFileCommand = {
        pathFilename: trailerPathFilename,
        bucketName: trailerBucketName,
      }
      const bucketFilePictureCommand: BucketFileCommand = {
        pathFilename: picturePathFilename,
        bucketName: pictureBucketName,
      }
      const bucketFileLogoCommand: BucketFileCommand = {
        pathFilename: logoPathFilename,
        bucketName: logoBucketName,
      }

      await CloudStorageS3Service.updateFileInDB(bucketFileTrailerCommand, trailer_files_id)
      await CloudStorageS3Service.updateFileInDB(bucketFilePictureCommand, picture_files_id)
      await CloudStorageS3Service.updateFileInDB(bucketFileLogoCommand, logo_files_id)

      // Updating in database
      const game: Game = await Game.findOrFail(id)
      return await game
        .merge({
          title,
          description,
          upcomingGame: upcomingGame,
          newGame: newGame,
        })
        .save()
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
        .preload('gameMedias')
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
      const query: ModelQueryBuilderContract<typeof Game, Game> = Game.query()
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
        .preload('gameMedias')

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
        return await query.exec()
      }

      // Pagination activée : on récupère le total des jeux
      const total: any = await query
        .clone()
        .count('* as total')
        .then((games: Game[]): any => games[0].$extras.total)
      const from: number = (page - 1) * perPage + 1
      const to: number = Math.min(from + perPage - 1, total)

      // Récupérer les jeux avec pagination
      const games: Game[] = await query.forPage(page, perPage).exec()

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
        .preload('gameMedias')
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
