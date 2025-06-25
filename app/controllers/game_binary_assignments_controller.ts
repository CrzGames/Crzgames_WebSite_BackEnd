import { HttpContext } from '@adonisjs/core/http'
import GameBinaryAssignmentsService from '#services/game_binary_assignments_service'
import GameBinaryAssignment from '#models/game_binary_assignment'
import GetAllGameBinaryAssignmentByGameIdValidator from '#validators/game_binary_assignment/get_all_game_binary_assignment_by_game_id_validator'

export default class GameBinaryAssignmentsController {
  //funtion to get all binaries of a game
  public async getAllGameBinaryAssignmentByGameId({
    request,
    response,
  }: HttpContext): Promise<void> {
    const payload: { gameId: number } = await request.validate(
      GetAllGameBinaryAssignmentByGameIdValidator,
    )

    // Récupération des jeux en utilisant le service GameBinaryAssignmentsService
    const gameBinaryAssignments: GameBinaryAssignment[] =
      await GameBinaryAssignmentsService.getAllGameBinaryAssignmentByGameId(payload.gameId)

    response.status(200).json(gameBinaryAssignments)
  }
}
