import GameCategory from '#models/game_category'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import logger from '@adonisjs/core/services/logger'
import { errors as lucidErrors } from '@adonisjs/lucid'

/**
 * Service pour gérer les catégories de jeux
 * Fournit des méthodes pour récupérer une catégorie de jeu par ID et toutes les catégories de jeux
 * @class GameCategoriesService
 */
export default class GameCategoriesService {
  /**
   * Fonction pour récupérer une catégorie de jeu par son ID
   * @param {number} categoryId - L'ID de la catégorie de jeu à récupérer
   * @returns {Promise<GameCategory>} - La catégorie de jeu correspondante
   */
  public static async getGameCategoriesById(categoryId: number): Promise<GameCategory> {
    try {
      // Récupérer la catégorie de jeu par son ID
      return await GameCategory.findOrFail(categoryId)
    } catch (error: any) {
      logger.error('getGameCategoriesById error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('Game Category not found')
      }

      throw new InternalServerErrorException('Failed to fetch game category by ID')
    }
  }

  /**
   * Fonction pour récupérer toutes les catégories de jeux
   * @returns {Promise<GameCategory[]>} - Un tableau de toutes les catégories de jeux
   */
  public static async getAllGameCategories(): Promise<GameCategory[]> {
    try {
      // Récupérer toutes les catégories de jeux
      const gameCategories: GameCategory[] = await GameCategory.all()

      // Vérifier si des catégories de jeux ont été trouvées
      if (gameCategories.length === 0) {
        throw new NotFoundException('No Game Categories found')
      }

      return gameCategories
    } catch (error) {
      logger.error('getAllGameCategories error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch all game categories')
    }
  }
}
