import type { HttpContext } from '@adonisjs/core/http'
import GameBinaryAssignmentsService from '#services/game_binary_assignments_service'
import type GameBinaryAssignment from '#models/game_binary_assignment'
import { getAllGameBinaryAssignmentByGameIdValidator } from '#validators/GameBinaryAssignment/GetAllGameBinaryAssignmentByGameIdValidator'

export default class GameBinaryAssignmentsController {
  //funtion to get all binaries of a game
  public async getAllGameBinaryAssignmentByGameId({ request, response }: HttpContext): Promise<void> {
    const payload: { gameId: number } = await request.validateUsing(getAllGameBinaryAssignmentByGameIdValidator)

    // Récupération des jeux en utilisant le service GameBinaryAssignmentsService
    const gameBinaryAssignments: GameBinaryAssignment[] =
      await GameBinaryAssignmentsService.getAllGameBinaryAssignmentByGameId(payload.gameId)

    response.status(200).json(gameBinaryAssignments)
  }
}
