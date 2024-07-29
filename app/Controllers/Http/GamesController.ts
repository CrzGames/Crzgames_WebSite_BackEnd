import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateGameValidator from 'App/Validators/Game/CreateGameValidator'
import GamesService from 'App/Services/GamesService'
import GameCategoryAssignmentsService from 'App/Services/GameCategoryAssignmentsService'
import GamePlatformAssignmentsService from 'App/Services/GamePlatformAssignmentsService'
import Game from 'App/Models/Game'
import GetGamesByIdValidator from 'App/Validators/Game/GetGamesByIdValidator'
import DeleteGamesValidator from 'App/Validators/Game/DeleteGamesValidator'
import UpdateGameValidator from 'App/Validators/Game/UpdateGameValidator'
import type { GameBinaryCommand } from 'App/Services/GameBinariesService'

export default class GamesController {
  private async createGames({ request, response }: HttpContextContract): Promise<void> {
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
    } = await request.validate(CreateGameValidator)

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
    await GameCategoryAssignmentsService.createGameCategoryAssignment(
      newGame.id,
      payload.categoryIds,
    )

    // Ajout des plateformes au game en utilisant le service GamePlatformAssignmentsService
    await GamePlatformAssignmentsService.createGamePlatformAssignment(
      newGame.id,
      payload.platformIds,
    )

    // Response 201 Document created
    response.status(201)
  }

  private async updateGames({ request, response }: HttpContextContract): Promise<void> {
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
    } = await request.validate(UpdateGameValidator)

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
    await GameCategoryAssignmentsService.createGameCategoryAssignment(
      updatedGame.id,
      payload.categoryIds,
    )

    // Suppression des plateformes du game pour ne pas les avoir en double
    await GamePlatformAssignmentsService.deleteAllGamePlatformAssignmentByGameId(updatedGame.id)
    // Update des plateformes au game pour les re-set en utilisant le service GamePlatformAssignmentsService
    await GamePlatformAssignmentsService.createGamePlatformAssignment(
      updatedGame.id,
      payload.platformIds,
    )

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

  private async deleteGames({ request, response }: HttpContextContract): Promise<void> {
    const payload: { id: number } = await request.validate(DeleteGamesValidator)
    await GamesService.deleteGames(payload.id)
    response.status(204).noContent()
  }

  private async getGamesById({ request, response }: HttpContextContract): Promise<void> {
    const payload: { id: number } = await request.validate(GetGamesByIdValidator)
    const game: Game = await GamesService.getGamesById(payload.id)
    return response.status(200).json(game)
  }

  private async getAllGamesByTitle({ params, response }: HttpContextContract): Promise<void> {
    const title: string = params.title
    const games: Game[] = await GamesService.getAllGamesByTitle(title)
    response.status(200).json(games)
  }

  private async getGameByTitle({ request, response }: HttpContextContract): Promise<void> {
    const title: string = request.input('title')
    const game: Game = await GamesService.getGameByTitle(title)
    response.status(200).json(game)
  }

  private async getAllGames({ response, request }: HttpContextContract): Promise<void> {
    const title: string = request.input('title')
    const games: Game[] = await GamesService.getAllGames(title)
    response.status(200).json(games)
  }
}
