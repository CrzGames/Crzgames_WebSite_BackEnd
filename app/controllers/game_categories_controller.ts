import { HttpContext } from '@adonisjs/core/http'
import GameCategoriesService from '#services/game_categories_service'
import GameCategory from '#models/game_category'

export default class GameCategoriesController {
  //function to get all user roles
  public async getAllGameCategories({ response }: HttpContext): Promise<void> {
    const gameCategories: GameCategory[] = await GameCategoriesService.getAllGameCategories()
    response.status(200).json(gameCategories)
  }
}
