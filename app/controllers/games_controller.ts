import type { HttpContext } from '@adonisjs/core/http'
import GamesService from '#services/games_service'
import type { CreateGamePayload, GamesResponse, UpdateGamePayload } from '#services/games_service'
import GameCategoryAssignmentsService from '#services/game_category_assignments_service'
import GamePlatformAssignmentsService from '#services/game_platform_assignments_service'
import GameBinariesService from '#services/game_binaries_service'
import GameBinaryAssignmentsService from '#services/game_binary_assignments_service'
import type Game from '#models/game'
import GameBinaryAssignment from '#models/game_binary_assignment'
import type GameBinary from '#models/game_binary'
import { updateGameValidator } from '#validators/game/update_game_validator'
import { createGameValidator } from '#validators/game/create_game_validator'
import BadRequestException from '#exceptions/bad_request_exception'

export default class GamesController {
  public async createGames({ request, response }: HttpContext): Promise<void> {
    // Recuperation des donnees de la requete
    const payload: CreateGamePayload = await request.validateUsing(createGameValidator)

    // Creation du game en utilisant le service GamesService
    const newGame: Game = await GamesService.createGames(payload)

    // Ajout des categories au game
    await GameCategoryAssignmentsService.createGameCategoryAssignment(newGame.id, payload.categoryIds)

    // Ajout des plateformes au game
    await GamePlatformAssignmentsService.createGamePlatformAssignment(newGame.id, payload.platformIds)

    // Ajout des langues au game
    await newGame.related('languages').sync(payload.languageIds)

    // Creation + assignation des binaries fournis au create
    if (payload.binaries && payload.binaries.length > 0) {
      const gameBinariesId: number[] = await GameBinariesService.createGameBinaries(payload.binaries)
      await GameBinaryAssignmentsService.createGameBinaryAssignments(newGame.id, gameBinariesId)
    }

    // Response 201 Document created
    response.status(201)
  }

  public async updateGames({ params, request, response }: HttpContext): Promise<void> {
    const gameId: number = Number(params.id)
    if (Number.isNaN(gameId)) {
      throw new BadRequestException('Invalid game id')
    }

    // Recuperation des donnees de la requete
    const payload: UpdateGamePayload = await request.validateUsing(updateGameValidator)

    // Update du game en utilisant le service GamesService
    const updatedGame: Game = await GamesService.updateGames(gameId, payload)

    // Suppression des categories du game pour ne pas les avoir en double
    await GameCategoryAssignmentsService.deleteAllGameCategoryAssignmentByGameId(updatedGame.id)
    // Update des categories au game pour les re-set
    await GameCategoryAssignmentsService.createGameCategoryAssignment(updatedGame.id, payload.categoryIds)

    // Suppression des plateformes du game pour ne pas les avoir en double
    await GamePlatformAssignmentsService.deleteAllGamePlatformAssignmentByGameId(updatedGame.id)
    // Update des plateformes au game pour les re-set
    await GamePlatformAssignmentsService.createGamePlatformAssignment(updatedGame.id, payload.platformIds)

    // Update des langues au game
    await updatedGame.related('languages').sync(payload.languageIds)

    // Update des binaries au game
    const existingGameBinaries: GameBinary[] = await updatedGame.related('gameBinary').query()
    await GameBinaryAssignment.query().where('games_id', updatedGame.id).delete()
    await Promise.all(
      existingGameBinaries.map(async (gameBinary: GameBinary): Promise<void> => {
        await GameBinariesService.deleteGameBinary(gameBinary.id)
      }),
    )

    if (payload.binaries && payload.binaries.length > 0) {
      const gameBinariesId: number[] = await GameBinariesService.createGameBinaries(payload.binaries)
      await GameBinaryAssignmentsService.createGameBinaryAssignments(updatedGame.id, gameBinariesId)
    }

    // Reponse 204 (No Content) si tout s'est bien passe
    response.status(204).noContent()
  }

  public async deleteGames({ params, response }: HttpContext): Promise<void> {
    const gameId: number = Number(params.id)
    if (Number.isNaN(gameId)) {
      throw new BadRequestException('Invalid game id')
    }

    await GamesService.deleteGames(gameId)
    response.status(204).noContent()
  }

  public async getGamesById({ params, response }: HttpContext): Promise<void> {
    const gameId: number = Number(params.id)
    if (Number.isNaN(gameId)) {
      throw new BadRequestException('Invalid game id')
    }

    const game: Game = await GamesService.getGamesById(gameId)
    response.status(200).json(game)
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
