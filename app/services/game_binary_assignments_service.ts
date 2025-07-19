import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import GameBinaryAssignment from '#models/game_binary_assignment'
import logger from '@adonisjs/core/services/logger'

/**
 * Service pour gérer les assignations de binaires à des jeux
 * Fournit des méthodes pour créer, supprimer et récupérer des assignations de binaires de jeu
 * @class GameBinaryAssignmentsService
 */
export default class GameBinaryAssignmentsService {
  /**
   * Méthode pour créer des assignations de binaires de jeu
   * @param {number} gameId - L'ID du jeu auquel les binaires seront assignés
   * @param {number[]} gameBinaryIds - Un tableau d'IDs de binaires de jeu à assigner
   * @returns {Promise<GameBinaryAssignment[]>} - Un tableau d'assignations de binaires de jeu créées
   */
  public static async createGameBinaryAssignments(
    gameId: number,
    gameBinaryIds: number[],
  ): Promise<GameBinaryAssignment[]> {
    try {
      // Créer des assignations de binaires de jeu en parallèle
      const binaries: Promise<GameBinaryAssignment>[] = gameBinaryIds.map(
        async (gameBinaryId: number): Promise<GameBinaryAssignment> => {
          return await GameBinaryAssignment.create({
            games_id: gameId,
            game_binaries_id: gameBinaryId,
          })
        },
      )

      // Attendre que toutes les assignations soient créées
      return await Promise.all(binaries)
    } catch (error: any) {
      logger.error('createGameBinaryAssignments error: ' + error.message)

      throw new InternalServerErrorException('Failed to create game binary assignments')
    }
  }

  /**
   * Méthode pour supprimer toutes les assignations de binaires d'un jeu par son ID
   * @param {number} gameId - L'ID du jeu dont les assignations de binaires seront supprimées
   * @returns {Promise<void>} - Une promesse qui résout lorsque toutes les assignations sont supprimées
   */
  public static async deleteAllGameBinaryAssignmentsByGameId(gameId: number): Promise<void> {
    try {
      // Récupérer toutes les assignations de binaires de jeu pour le jeu donné par son ID
      const gameBinaryAssignments: GameBinaryAssignment[] = await GameBinaryAssignment.query().where('games_id', gameId)

      // Vérifier si des assignations ont été trouvées
      if (gameBinaryAssignments.length === 0) {
        throw new NotFoundException('No Game Binary Assignments found for given Game ID')
      }

      // Supprimer toutes les assignations de binaires de jeu en parallèle
      await Promise.all(
        gameBinaryAssignments.map(async (gameBinaryAssignment: GameBinaryAssignment): Promise<void> => {
          await gameBinaryAssignment.delete()
        }),
      )
    } catch (error: any) {
      logger.error('deleteAllGameBinaryAssignmentsByGameId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to delete all game binary assignments')
    }
  }

  /**
   * Méthode pour créer une assignation de binaire de jeu
   * @param {number} gameId - L'ID du jeu auquel le binaire sera assigné
   * @param {number} gameBinaryId - L'ID du binaire de jeu à assigner
   * @returns {Promise<GameBinaryAssignment>} - L'assignation de binaire de jeu créée
   */
  public static async createGameBinaryAssignment(gameId: number, gameBinaryId: number): Promise<GameBinaryAssignment> {
    try {
      // Créer une assignation de binaire de jeu
      return await GameBinaryAssignment.create({
        games_id: gameId,
        game_binaries_id: gameBinaryId,
      })
    } catch (error: any) {
      logger.error('createGameBinaryAssignment error: ' + error.message)

      throw new InternalServerErrorException('Failed to create game binary assignment')
    }
  }

  /**
   * Méthode pour récupérer toutes les assignations de binaires de jeu par l'ID du jeu
   * @param {number} gameId - L'ID du jeu pour lequel récupérer les assignations de binaires
   * @returns {Promise<GameBinaryAssignment[]>} - Un tableau d'assignations de binaires de jeu
   */
  public static async getAllGameBinaryAssignmentByGameId(gameId: number): Promise<GameBinaryAssignment[]> {
    try {
      // Récupérer toutes les assignations de binaires de jeu pour le jeu donné par son ID
      const binaryAssignments: GameBinaryAssignment[] = await GameBinaryAssignment.query()
        .preload('gameBinary')
        .preload('game')
        .where('games_id', gameId)

      // Vérifier si des assignations ont été trouvées
      if (binaryAssignments.length === 0) {
        throw new NotFoundException('No Game Binary Assignments found for given Game ID')
      }

      return binaryAssignments
    } catch (error: any) {
      logger.error('getAllGameBinaryAssignmentByGameId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch all game binary assignments by game ID')
    }
  }
}
