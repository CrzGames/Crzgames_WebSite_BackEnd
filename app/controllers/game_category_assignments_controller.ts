import type { HttpContext } from '@adonisjs/core/http'
import GameCategoryAssignmentsService from '#services/game_category_assignments_service'
import type GameCategoryAssignment from '#models/game_category_assignment'
import { getAllGameCategoryAssignmentByCategoryIdValidator } from '#validators/game_category_assignment/get_all_game_category_assignment_by_category_id_validator'
import { getAllGameCategoryAssignmentByGameIdValidator } from '#validators/game_category_assignment/get_all_game_category_assignment_by_game_id_validator'
export default class GameCategoryAssignmentsController {
  //function to get all categories of a game
  public async getAllGameCategoryAssignmentByGameId({ request, response }: HttpContext): Promise<void> {
    const payload: { gameId: number } = await request.validateUsing(getAllGameCategoryAssignmentByGameIdValidator)

    // Récupération des jeux en utilisant le service GameCategoryAssignmentsService
    const gameCategoryAssignments: GameCategoryAssignment[] =
      await GameCategoryAssignmentsService.getAllGameCategoryAssignmentByGameId(payload.gameId)

    response.status(200).json(gameCategoryAssignments)
  }

  //function to get all games by category
  public async getAllGameCategoryAssignmentByCategoryId({ request, response }: HttpContext): Promise<void> {
    const payload: { categoryId: number } = await request.validateUsing(
      getAllGameCategoryAssignmentByCategoryIdValidator,
    )

    // Récupération des ids des jeux en utilisant le service GameCategoryAssignmentsService
    const gameCategoryAssignments: GameCategoryAssignment[] =
      await GameCategoryAssignmentsService.getAllGameCategoryAssignmentByCategoryId(payload.categoryId)

    // Réponse avec les games récupéré
    return response.status(200).json(gameCategoryAssignments)
  }
}
