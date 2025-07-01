import type { HttpContext } from '@adonisjs/core/http'
import GamesService from '#services/games_service'
import type { GamesResponse } from '#services/games_service'
import GameCategoryAssignmentsService from '#services/game_category_assignments_service'
import GamePlatformAssignmentsService from '#services/game_platform_assignments_service'
import type Game from '#models/game'
import type { GameBinaryCommand } from '#services/game_binaries_service'
import { updateGameValidator } from '#validators/game/update_game_validator'
import { createGameValidator } from '#validators/game/create_game_validator'
import { deleteGamesValidator } from '#validators/game/delete_games_validator'
import { getGamesByIdValidator } from '#validators/game/get_games_by_id_validator'

export default class GamesController {
  public async createGames({ request, response }: HttpContext): Promise<void> {
    // Récupération des données de la requête
    const payload: {
      title: string
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
      // binaries: GameBinaryCommand[]
      description: string
    } = await request.validateUsing(createGameValidator)

    // Création du game en utilisant le service GamesService
    const newGame: Game = await GamesService.createGames(
      payload.title,
      payload.upcomingGame,
      payload.newGame,
      payload.trailerPathFilename,
      payload.trailerBucketName,
      payload.picturePathFilename,
      payload.pictureBucketName,
      payload.logoPathFilename,
      payload.logoBucketName,
      payload.description,
    )

    /* A REFAIRE COTE FRONT END pour que cela marche
    // Création des binaries en utilisant le service GameBinariesService
    const gameBinariesId: number[] = await GameBinariesService.createGameBinaries(payload.binaries)
    // Ajout des binaries au game en utilisant le service GameBinaryAssignmentsService
    await GameBinaryAssignmentsService.createGameBinaryAssignments(newGame.id, gameBinariesId)
    */

    // Ajout des catégories au game en utilisant le service GameCategoryAssignmentsService
    await GameCategoryAssignmentsService.createGameCategoryAssignment(newGame.id, payload.categoryIds)

    // Ajout des plateformes au game en utilisant le service GamePlatformAssignmentsService
    await GamePlatformAssignmentsService.createGamePlatformAssignment(newGame.id, payload.platformIds)

    // Response 201 Document created
    response.status(201)
  }

  public async updateGames({ request, response }: HttpContext): Promise<void> {
    // Récupération des données de la requête
    const payload: {
      id: number
      title: string
      upcomingGame: boolean
      newGame: boolean
      trailerFilesId: number
      logoFilesId: number
      pictureFileId: number
      trailerPathFilename: string
      trailerBucketName: string
      picturePathFilename: string
      pictureBucketName: string
      logoPathFilename: string
      logoBucketName: string
      categoryIds: number[]
      platformIds: number[]
      binaries: GameBinaryCommand[]
      description: string
    } = await request.validateUsing(updateGameValidator)

    // Update du game en utilisant le service GamesService
    const updatedGame: Game = await GamesService.updateGames(
      payload.id,
      payload.title,
      payload.upcomingGame,
      payload.newGame,
      payload.trailerPathFilename,
      payload.trailerBucketName,
      payload.picturePathFilename,
      payload.pictureBucketName,
      payload.logoPathFilename,
      payload.logoBucketName,
      payload.trailerFilesId,
      payload.logoFilesId,
      payload.pictureFileId,
      payload.description,
    )

    // Suppression des catégories du game pour ne pas les avoir en double
    await GameCategoryAssignmentsService.deleteAllGameCategoryAssignmentByGameId(updatedGame.id)
    // Update des catégories au game pour les re-set en utilisant le service GameCategoryAssignmentsService
    await GameCategoryAssignmentsService.createGameCategoryAssignment(updatedGame.id, payload.categoryIds)

    // Suppression des plateformes du game pour ne pas les avoir en double
    await GamePlatformAssignmentsService.deleteAllGamePlatformAssignmentByGameId(updatedGame.id)
    // Update des plateformes au game pour les re-set en utilisant le service GamePlatformAssignmentsService
    await GamePlatformAssignmentsService.createGamePlatformAssignment(updatedGame.id, payload.platformIds)

    /* A REFAIRE COTE FRONT END pour que cela marche
    // Suppression des game_binaries_assignments du game (qui vas delete en cascade pour les game_binaries) pour ne pas les avoir en double
    await GameBinaryAssignmentsService.deleteAllGameBinaryAssignmentsByGameId(updatedGame.id)
    // Création des binaries en utilisant le service GameBinariesService
    const gameBinariesId: number[] = await GameBinariesService.createGameBinaries(payload.binaries)
    // Ajout des binaries au game en utilisant le service GameBinaryAssignmentsService
    await GameBinaryAssignmentsService.createGameBinaryAssignments (updatedGame.id, gameBinariesId)
    */

    // Réponse 204 (No Content) si tout s'est bien passé
    response.status(204).noContent()
  }

  public async deleteGames({ request, response }: HttpContext): Promise<void> {
    const payload: { id: number } = await request.validateUsing(deleteGamesValidator)
    await GamesService.deleteGames(payload.id)
    response.status(204).noContent()
  }

  public async getGamesById({ request, response }: HttpContext): Promise<void> {
    const payload: { id: number } = await request.validateUsing(getGamesByIdValidator)
    const game: Game = await GamesService.getGamesById(payload.id)
    return response.status(200).json(game)
  }

  public async getAllGamesByTitle({ params, response }: HttpContext): Promise<void> {
    const title: string = params.title
    const games: Game[] = await GamesService.getAllGamesByTitle(title)
    response.status(200).json(games)
  }

  public async getGameByTitle({ request, response }: HttpContext): Promise<void> {
    const title: string = request.input('title')
    const game: Game = await GamesService.getGameByTitle(title)
    response.status(200).json(game)
  }

  public async getAllGames({ response, request }: HttpContext): Promise<void> {
    const title: string | undefined = request.input('title')
    const page: number | undefined = request.input('page') ? Number(request.input('page')) : undefined
    const perPage: number | undefined = request.input('perPage') ? Number(request.input('perPage')) : undefined
    const genres: string[] | undefined = request.input('genres') ? request.input('genres', []).split(',') : undefined
    const languages: string[] | undefined = request.input('languages')
      ? request.input('languages', []).split(',')
      : undefined
    const gameModes: string[] | undefined = request.input('gameModes')
      ? request.input('gameModes', []).split(',')
      : undefined
    const featuredGames: boolean | undefined = request.input('featuredGames')
      ? request.input('featuredGames') === 'true'
      : undefined
    const sortBy: string | undefined = request.input('sortBy')

    const games: GamesResponse = await GamesService.getAllGames(
      title,
      page,
      perPage,
      genres,
      languages,
      gameModes,
      featuredGames,
      sortBy,
    )
    response.status(200).json(games)
  }
}
