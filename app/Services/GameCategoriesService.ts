import GameCategory from 'App/Models/GameCategory'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'

export default class GameCategoriesService {
  // Fonction pour récupérer une catégorie de jeu par ID
  public static async getGameCategoriesById(categoryId: number): Promise<GameCategory> {
    try {
      return await GameCategory.findOrFail(categoryId)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // Fonction pour récupérer toutes les catégories de jeux
  public static async getAllGameCategories(): Promise<GameCategory[]> {
    try {
      const gameCategories: GameCategory[] = await GameCategory.all()

      if (!gameCategories || gameCategories.length === 0) {
        throw new NotFoundException('No Game Categories found')
      }

      return gameCategories
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
