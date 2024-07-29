import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GamesService from 'App/Services/GamesService'
import GamePlatformAssignmentsService from 'App/Services/GamePlatformAssignmentsService'
import GamePlatformAssignment from 'App/Models/GamePlatformAssignment'
import Game from 'App/Models/Game'
import GetAllGamePlatformAssignmentByGameIdValidator from 'App/Validators/GamePlatformAssignment/GetAllGamePlatformAssignmentByGameIdValidator'
import GetAllGamePlatformAssignmentByPlatformIdValidator from 'App/Validators/GamePlatformAssignment/GetAllGamePlatformAssignmentByPlatformIdValidator'

export default class GamePlatformAssignmentsController {
  //function to get all platforms of a game
  private async getAllGamePlatformAssignmentByGameId({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: { gameId: number } = await request.validate(
      GetAllGamePlatformAssignmentByGameIdValidator,
    )

    // Récupération des jeux en utilisant le service GamePlatformAssignmentsService
    const gamePlatformAssignments: GamePlatformAssignment[] =
      await GamePlatformAssignmentsService.getAllGamePlatformAssignmentByGameId(payload.gameId)

    response.status(200).json(gamePlatformAssignments)
  }

  // function to get all games by platform
  private async getAllGamePlatformAssignmentByPlatformId({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: { platformId: number } = await request.validate(
      GetAllGamePlatformAssignmentByPlatformIdValidator,
    )

    // Récupération des jeux en utilisant le service GamePlatformAssignmentsService
    const gamePlatformAssignments: GamePlatformAssignment[] =
      await GamePlatformAssignmentsService.getAllGamePlatformAssignmentByPlatformId(
        payload.platformId,
      )

    // recuperation des jeux en bouclant sur les ids
    const games: Game[] = []

    for (const gamePlatformAssignment of gamePlatformAssignments.map(
      (gamePlatformAssignment: GamePlatformAssignment) => gamePlatformAssignment.games_id,
    )) {
      const game: Game = await GamesService.getGamesById(gamePlatformAssignment)
      games.push(game)
    }

    // Réponse avec les games récupéré
    response.status(200).json(games)
  }
}
