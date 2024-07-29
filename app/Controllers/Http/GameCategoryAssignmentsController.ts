import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GameCategoryAssignmentsService from 'App/Services/GameCategoryAssignmentsService'
import GameCategoryAssignment from 'App/Models/GameCategoryAssignment'
import GetAllGameCategoryAssignmentByGameIdValidator from 'App/Validators/GameCategoryAssignment/GetAllGameCategoryAssignmentByGameIdValidator'
import GetAllGameCategoryAssignmentByCategoryIdValidator from 'App/Validators/GameCategoryAssignment/GetAllGameCategoryAssignmentByCategoryIdValidator'

export default class GameCategoryAssignmentsController {
  //function to get all categories of a game
  private async getAllGameCategoryAssignmentByGameId({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: { gameId: number } = await request.validate(
      GetAllGameCategoryAssignmentByGameIdValidator,
    )

    // Récupération des jeux en utilisant le service GameCategoryAssignmentsService
    const gameCategoryAssignments: GameCategoryAssignment[] =
      await GameCategoryAssignmentsService.getAllGameCategoryAssignmentByGameId(payload.gameId)

    response.status(200).json(gameCategoryAssignments)
  }

  //function to get all games by category
  private async getAllGameCategoryAssignmentByCategoryId({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: { categoryId: number } = await request.validate(
      GetAllGameCategoryAssignmentByCategoryIdValidator,
    )

    // Récupération des ids des jeux en utilisant le service GameCategoryAssignmentsService
    const gameCategoryAssignments: GameCategoryAssignment[] =
      await GameCategoryAssignmentsService.getAllGameCategoryAssignmentByCategoryId(
        payload.categoryId,
      )

    // Réponse avec les games récupéré
    return response.status(200).json(gameCategoryAssignments)
  }
}
