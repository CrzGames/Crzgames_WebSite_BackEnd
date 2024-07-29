import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GameBinaryAssignmentsService from 'App/Services/GameBinaryAssignmentsService'
import GameBinaryAssignment from 'App/Models/GameBinaryAssignment'
import GetAllGameBinaryAssignmentByGameIdValidator from 'App/Validators/GameBinaryAssignment/GetAllGameBinaryAssignmentByGameIdValidator'

export default class GameBinaryAssignmentsController {
  //funtion to get all binaries of a game
  private async getAllGameBinaryAssignmentByGameId({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: { gameId: number } = await request.validate(
      GetAllGameBinaryAssignmentByGameIdValidator,
    )

    // Récupération des jeux en utilisant le service GameBinaryAssignmentsService
    const gameBinaryAssignments: GameBinaryAssignment[] =
      await GameBinaryAssignmentsService.getAllGameBinaryAssignmentByGameId(payload.gameId)

    response.status(200).json(gameBinaryAssignments)
  }
}
