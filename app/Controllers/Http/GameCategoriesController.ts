import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GameCategoriesService from 'App/Services/GameCategoriesService'
import GameCategory from 'App/Models/GameCategory'

export default class GameCategoriesController {
  //function to get all user roles
  private async getAllGameCategories({ response }: HttpContextContract): Promise<void> {
    const gameCategories: GameCategory[] = await GameCategoriesService.getAllGameCategories()
    response.status(200).json(gameCategories)
  }
}
