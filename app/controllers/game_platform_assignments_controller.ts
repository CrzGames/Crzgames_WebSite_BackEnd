import { HttpContext } from '@adonisjs/core/http'
import GamesService from '#services/games_service'
import GamePlatformAssignmentsService from '#services/game_platform_assignments_service'
import GamePlatformAssignment from '#models/game_platform_assignment'
import Game from '#models/game'
import GetAllGamePlatformAssignmentByGameIdValidator from '#validators/game_platform_assignment/get_all_game_platform_assignment_by_game_id_validator'
import GetAllGamePlatformAssignmentByPlatformIdValidator from '#validators/game_platform_assignment/get_all_game_platform_assignment_by_platform_id_validator'

export default class GamePlatformAssignmentsController {
  //function to get all platforms of a game
  public async getAllGamePlatformAssignmentByGameId({ request, response }: HttpContext): Promise<void> {
    const payload: { gameId: number } = await request.validate(GetAllGamePlatformAssignmentByGameIdValidator)

    // Récupération des jeux en utilisant le service GamePlatformAssignmentsService
    const gamePlatformAssignments: GamePlatformAssignment[] =
      await GamePlatformAssignmentsService.getAllGamePlatformAssignmentByGameId(payload.gameId)

    response.status(200).json(gamePlatformAssignments)
  }

  // function to get all games by platform
  public async getAllGamePlatformAssignmentByPlatformId({ request, response }: HttpContext): Promise<void> {
    const payload: { platformId: number } = await request.validate(GetAllGamePlatformAssignmentByPlatformIdValidator)

    // Récupération des jeux en utilisant le service GamePlatformAssignmentsService
    const gamePlatformAssignments: GamePlatformAssignment[] =
      await GamePlatformAssignmentsService.getAllGamePlatformAssignmentByPlatformId(payload.platformId)

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
