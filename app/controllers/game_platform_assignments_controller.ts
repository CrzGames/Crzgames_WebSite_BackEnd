import type { HttpContext } from '@adonisjs/core/http'
import GamesService from '#services/games_service'
import GamePlatformAssignmentsService from '#services/game_platform_assignments_service'
import type GamePlatformAssignment from '#models/game_platform_assignment'
import type Game from '#models/game'
import { getAllGamePlatformAssignmentByGameIdValidator } from '#validators/GamePlatformAssignment/GetAllGamePlatformAssignmentByGameIdValidator'
import { getAllGamePlatformAssignmentByPlatformIdValidator } from '#validators/GamePlatformAssignment/GetAllGamePlatformAssignmentByPlatformIdValidator'

/**
 *
 */
export default class GamePlatformAssignmentsController {
  //function to get all platforms of a game
  /**
   *
   */
  public async getAllGamePlatformAssignmentByGameId({ request, response }: HttpContext): Promise<void> {
    const payload: { params: { gameId: number } } = await request.validateUsing(
      getAllGamePlatformAssignmentByGameIdValidator,
    )

    const gamePlatformAssignments: GamePlatformAssignment[] =
      await GamePlatformAssignmentsService.getAllGamePlatformAssignmentByGameId(payload.params.gameId)

    response.status(200).json(gamePlatformAssignments)
  }

  // function to get all games by platform
  /**
   *
   */
  public async getAllGamePlatformAssignmentByPlatformId({ request, response }: HttpContext): Promise<void> {
    const payload: { params: { platformId: number } } = await request.validateUsing(
      getAllGamePlatformAssignmentByPlatformIdValidator,
    )

    const gamePlatformAssignments: GamePlatformAssignment[] =
      await GamePlatformAssignmentsService.getAllGamePlatformAssignmentByPlatformId(payload.params.platformId)

    const games: Game[] = []
    const gameIds: number[] = gamePlatformAssignments
      .map((gamePlatformAssignment: GamePlatformAssignment): number | null => gamePlatformAssignment.gamesId)
      .filter((gameId: number | null): gameId is number => gameId !== null)

    for (const gameId of gameIds) {
      const game: Game = await GamesService.getGamesById(gameId)
      games.push(game)
    }

    response.status(200).json(games)
  }
}
