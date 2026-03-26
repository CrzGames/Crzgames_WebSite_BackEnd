import type { HttpContext } from '@adonisjs/core/http'
import GameCategoryAssignmentsService from '#services/game_category_assignments_service'
import type GameCategoryAssignment from '#models/game_category_assignment'
import { getAllGameCategoryAssignmentByCategoryIdValidator } from '#validators/game_category_assignment/get_all_game_category_assignment_by_category_id_validator'
import { getAllGameCategoryAssignmentByGameIdValidator } from '#validators/game_category_assignment/get_all_game_category_assignment_by_game_id_validator'

/**
 *
 */
export default class GameCategoryAssignmentsController {
  //function to get all categories of a game
  /**
   *
   */
  public async getAllGameCategoryAssignmentByGameId({ request, response }: HttpContext): Promise<void> {
    const payload: { params: { gameId: number } } = await request.validateUsing(
      getAllGameCategoryAssignmentByGameIdValidator,
    )

    const gameCategoryAssignments: GameCategoryAssignment[] =
      await GameCategoryAssignmentsService.getAllGameCategoryAssignmentByGameId(payload.params.gameId)

    response.status(200).json(gameCategoryAssignments)
  }

  //function to get all games by category
  /**
   *
   */
  public async getAllGameCategoryAssignmentByCategoryId({ request, response }: HttpContext): Promise<void> {
    const payload: { params: { categoryId: number } } = await request.validateUsing(
      getAllGameCategoryAssignmentByCategoryIdValidator,
    )

    const gameCategoryAssignments: GameCategoryAssignment[] =
      await GameCategoryAssignmentsService.getAllGameCategoryAssignmentByCategoryId(payload.params.categoryId)

    response.status(200).json(gameCategoryAssignments)
  }
}
