import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import GameCategoryAssignment from '#models/game_category_assignment'
import logger from '@adonisjs/core/services/logger'

/**
 * Service pour gérer les assignations de catégories de jeux
 * Fournit des méthodes pour créer, récupérer et supprimer des assignations de catégories de jeux
 * @class GameCategoryAssignmentsService
 */
export default class GameCategoryAssignmentsService {
  /**
   * Fonction pour créer une assignation de catégorie de jeu
   * @param {number} gameId - L'ID du jeu auquel la catégorie sera assignée
   * @param {number[]} gameCategoryIds - Un tableau d'IDs de catégories de jeux à assigner
   * @returns {Promise<GameCategoryAssignment[]>} - Un tableau d'assignations de catégories de jeux créées
   */
  public static async createGameCategoryAssignment(
    gameId: number,
    gameCategoryIds: number[],
  ): Promise<GameCategoryAssignment[]> {
    try {
      // Créer des assignations de catégories de jeux en parallèle
      const gameCategoryAssignments: Promise<GameCategoryAssignment>[] = gameCategoryIds.map(
        async (gameCategoryId: number): Promise<GameCategoryAssignment> => {
          return await GameCategoryAssignment.create({
            gamesId: gameId,
            gameCategoriesId: gameCategoryId,
          })
        },
      )

      // Attendre que toutes les assignations soient créées
      return await Promise.all(gameCategoryAssignments)
    } catch (error: any) {
      logger.error('createGameCategoryAssignment error: ' + error.message)

      throw new InternalServerErrorException('Failed to create game category assignment')
    }
  }

  /**
   * Fonction pour récupérer toutes les assignations de catégories de jeux par ID de jeu
   * @param {number} gameId - L'ID du jeu pour lequel récupérer les assignations de catégories
   * @returns {Promise<GameCategoryAssignment[]>} - Un tableau d'assignations de catégories de jeux
   */
  public static async getAllGameCategoryAssignmentByGameId(gameId: number): Promise<GameCategoryAssignment[]> {
    try {
      // Récupérer toutes les assignations de catégories de jeux pour le jeu donné par son ID
      const gameCategoryAssignments: GameCategoryAssignment[] = await GameCategoryAssignment.query()
        .preload('game')
        .preload('gameCategory')
        .where('games_id', gameId)

      if (gameCategoryAssignments.length === 0) {
        throw new NotFoundException('No Game Category Assignments found for given Game ID')
      }

      return gameCategoryAssignments
    } catch (error: any) {
      logger.error('getAllGameCategoryAssignmentByGameId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch get all game category assignments by game ID')
    }
  }

  /**
   * Fonction pour supprimer toutes les assignations de catégories de jeux par ID de jeu
   * @param {number} gameId - L'ID du jeu pour lequel supprimer les assignations de catégories
   * @returns {Promise<void>} - Aucune valeur de retour, la fonction supprime les assignations
   */
  public static async deleteAllGameCategoryAssignmentByGameId(gameId: number): Promise<void> {
    try {
      // Récupérer toutes les assignations de catégories de jeux pour le jeu donné par son ID
      const gameCategoryAssignments: GameCategoryAssignment[] = await GameCategoryAssignment.query()
        .preload('game')
        .preload('gameCategory')
        .where('games_id', gameId)

      // Vérifier si des assignations de catégories de jeux ont été trouvées
      if (gameCategoryAssignments.length === 0) {
        throw new NotFoundException('No Game Category Assignments found for given Game ID')
      }

      // Supprimer toutes les assignations de catégories de jeux en parallèle par rapport à l'ID du jeu
      await Promise.all(
        gameCategoryAssignments.map(async (gameCategoryAssignment: GameCategoryAssignment): Promise<void> => {
          await gameCategoryAssignment.delete()
        }),
      )
    } catch (error: any) {
      logger.error('deleteAllGameCategoryAssignmentByGameId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to delete all game category assignments by game ID')
    }
  }

  /**
   * Fonction pour récupérer toutes les assignations de catégories de jeux par ID de catégorie
   * @param {number} categoryId - L'ID de la catégorie pour laquelle récupérer les assignations de jeux
   * @returns {Promise<GameCategoryAssignment[]>} - Un tableau d'assignations de catégories de jeux
   */
  public static async getAllGameCategoryAssignmentByCategoryId(categoryId: number): Promise<GameCategoryAssignment[]> {
    try {
      // Récupérer toutes les assignations de catégories de jeux pour la catégorie donnée par son ID
      const gameCategoryAssignments: GameCategoryAssignment[] = await GameCategoryAssignment.query()
        .preload('game')
        .preload('gameCategory')
        .where('game_categories_id', categoryId)

      // Vérifier si des assignations de catégories de jeux ont été trouvées
      if (gameCategoryAssignments.length === 0) {
        throw new NotFoundException('No Game Category Assignments found for given Category ID')
      }

      return gameCategoryAssignments
    } catch (error) {
      logger.error('getAllGameCategoryAssignmentByCategoryId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch all game category assignments by category ID')
    }
  }
}
