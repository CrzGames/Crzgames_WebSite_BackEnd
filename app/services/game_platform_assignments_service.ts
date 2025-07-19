import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import GamePlatformAssignment from '#models/game_platform_assignment'
import logger from '@adonisjs/core/services/logger'

/**
 * Service pour gérer les assignations de plateformes de jeux
 * Fournit des méthodes pour créer, supprimer et récupérer les assignations de plateformes de jeux
 * @class GamePlatformAssignmentsService
 */
export default class GamePlatformAssignmentsService {
  /**
   * Fonction pour créer une assignation de plateforme de jeu
   * @param {number} gameId - L'ID du jeu auquel la plateforme sera assignée
   * @param {number[]} gamePlatformIds - Un tableau d'IDs de plateformes de jeux à assigner
   * @returns {Promise<GamePlatformAssignment[]>} - Un tableau d'assignations de plateformes de jeux créées
   */
  public static async createGamePlatformAssignment(
    gameId: number,
    gamePlatformIds: number[],
  ): Promise<GamePlatformAssignment[]> {
    try {
      // Créer une assignation de plateforme de jeu pour chaque ID de plateforme fourni
      const gamePlatformAssignments: Promise<GamePlatformAssignment>[] = gamePlatformIds.map(
        async (gamePlatformId: number): Promise<GamePlatformAssignment> => {
          return await GamePlatformAssignment.create({
            games_id: gameId,
            game_platforms_id: gamePlatformId,
          })
        },
      )

      // Attendre que toutes les assignations soient créées
      return await Promise.all(gamePlatformAssignments)
    } catch (error: any) {
      logger.error('createGamePlatformAssignment error: ' + error.message)

      throw new InternalServerErrorException('Failed to create game platform assignments')
    }
  }

  /**
   * Fonction pour supprimer une assignation de plateforme de jeu par son ID
   * @param {number} gameId - L'ID de l'assignation de plateforme de jeu à supprimer
   * @returns {Promise<void>} - Vide si la suppression est réussie
   */
  public static async deleteAllGamePlatformAssignmentByGameId(gameId: number): Promise<void> {
    try {
      // Récupérer toutes les assignations de plateformes de jeux pour le jeu spécifié par son ID
      const gamePlatformAssignments: GamePlatformAssignment[] = await GamePlatformAssignment.query()
        .preload('game')
        .preload('gamePlatform')
        .where('games_id', gameId)

      // Vérifier si des assignations de plateformes de jeux ont été trouvées
      if (gamePlatformAssignments.length === 0) {
        throw new NotFoundException(`No Game Platform Assignments found for Game ID: ${gameId}`)
      }

      // Supprimer toutes les assignations de plateformes de jeux trouvées
      await Promise.all(
        gamePlatformAssignments.map(async (gamePlatformAssignment: GamePlatformAssignment): Promise<void> => {
          await gamePlatformAssignment.delete()
        }),
      )
    } catch (error: any) {
      logger.error('deleteAllGamePlatformAssignmentByGameId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to delete game platform assignments')
    }
  }

  /**
   * Fonction pour récupérer toutes les assignations de plateformes de jeux par l'ID de la plateforme
   * @param {number} platformId - L'ID de la plateforme pour laquelle récupérer les assignations
   * @returns {Promise<GamePlatformAssignment[]>} - Un tableau d'assignations de plateformes de jeux
   */
  public static async getAllGamePlatformAssignmentByPlatformId(platformId: number): Promise<GamePlatformAssignment[]> {
    try {
      // Récupérer toutes les assignations de plateformes de jeux pour la plateforme spécifiée par son ID
      const gamePlatformAssignments: GamePlatformAssignment[] = await GamePlatformAssignment.query()
        .preload('game')
        .preload('gamePlatform')
        .where('game_platforms_id', platformId)

      // Vérifier si des assignations de plateformes de jeux ont été trouvées
      if (gamePlatformAssignments.length === 0) {
        throw new NotFoundException('No Game Platform Assignments found for given Platform ID')
      }

      return gamePlatformAssignments
    } catch (error: any) {
      logger.error('getAllGamePlatformAssignmentByPlatformId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch game platform assignments by platform ID')
    }
  }

  /**
   * Fonction pour récupérer toutes les assignations de plateformes de jeux par l'ID du jeu
   * @param {number} gameId - L'ID du jeu pour lequel récupérer les assignations
   * @returns {Promise<GamePlatformAssignment[]>} - Un tableau d'assignations de plateformes de jeux
   */
  public static async getAllGamePlatformAssignmentByGameId(gameId: number): Promise<GamePlatformAssignment[]> {
    try {
      // Récupérer toutes les assignations de plateformes de jeux pour le jeu spécifié par son ID
      const gamePlatformAssignments: GamePlatformAssignment[] = await GamePlatformAssignment.query()
        .preload('game')
        .preload('gamePlatform')
        .where('games_id', gameId)

      // Vérifier si des assignations de plateformes de jeux ont été trouvées
      if (gamePlatformAssignments.length === 0) {
        throw new NotFoundException('No Game Platform Assignments found for given Game ID')
      }

      return gamePlatformAssignments
    } catch (error: any) {
      logger.error('getAllGamePlatformAssignmentByGameId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch game platform assignments by game ID')
    }
  }
}
