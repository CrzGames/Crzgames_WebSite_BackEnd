import NotFoundException from '#exceptions/not_found_exception'
import GamePlatform from '#models/game_platform'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import { errors as lucidErrors } from '@adonisjs/lucid'
import logger from '@adonisjs/core/services/logger'

/**
 * Service pour gérer les plateformes de jeux
 * Fournit des méthodes pour récupérer une plateforme de jeu par ID et toutes les plateformes de jeux
 * @class GamePlatformsService
 */
export default class GamePlatformsService {
  /**
   * Fonction pour récupérer une plateforme de jeu par son ID
   * @param {number} platformId - L'ID de la plateforme de jeu à récupérer
   * @returns {Promise<GamePlatform>} - La plateforme de jeu correspondante
   */
  public static async getGamePlatformsById(platformId: number): Promise<GamePlatform> {
    try {
      // Récupérer la plateforme de jeu par son ID
      return await GamePlatform.findOrFail(platformId)
    } catch (error: any) {
      logger.error('getGamePlatformsById error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Game Platform with ID ${platformId} not found`)
      }

      throw new InternalServerErrorException(`Failed to fetch game platform with ID ${platformId}`)
    }
  }

  /**
   * Fonction pour récupérer toutes les plateformes de jeux
   * @returns {Promise<GamePlatform[]>} - Un tableau de toutes les plateformes de jeux
   */
  public static async getAllGamePlatforms(): Promise<GamePlatform[]> {
    try {
      // Récupérer toutes les plateformes de jeux
      const gamePlatforms: GamePlatform[] = await GamePlatform.all()

      // Vérifier si des plateformes de jeux ont été trouvées
      if (gamePlatforms.length === 0) {
        throw new NotFoundException(`No Game Platforms found`)
      }

      return gamePlatforms
    } catch (error) {
      logger.error('getAllGamePlatforms error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch game platforms')
    }
  }
}
