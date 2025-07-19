import GameServer from '#models/game_server'
import NotFoundException from '#exceptions/not_found_exception'
import BadRequestException from '#exceptions/bad_request_exception'
import logger from '@adonisjs/core/services/logger'

/**
 * Service pour gérer les serveurs de jeux
 * Fournit des méthodes pour récupérer tous les serveurs de jeux et créer un nouveau serveur de jeux
 * @class GameServerService
 */
export default class GameServerService {
  /**
   * Fonction pour récupérer tous les serveurs de jeux
   * @returns {Promise<GameServer[]>} - Un tableau de tous les serveurs de jeux
   */
  public static async getAllGameServers(): Promise<GameServer[]> {
    try {
      // Récupérer tous les serveurs de jeux
      const gameServers: GameServer[] = await GameServer.all()

      // Vérifier si des serveurs de jeux ont été trouvés
      if (gameServers.length === 0) {
        throw new NotFoundException('No game servers found')
      }

      return gameServers
    } catch (error: any) {
      logger.error('getAllGameServers error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new BadRequestException('Failed to fetch game servers')
    }
  }

  /**
   * Fonction pour créer un nouveau serveur de jeux
   * @param {string} name - Le nom du serveur de jeux
   * @param {string} region - La région du serveur de jeux
   * @returns {Promise<GameServer>} - Le serveur de jeux créé
   */
  public static async createGameServer(name: string, region: string): Promise<GameServer> {
    try {
      // Créer un nouveau serveur de jeux
      return await GameServer.create({
        name: name,
        region: region,
      })
    } catch (error: any) {
      logger.error('createGameServer error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new BadRequestException('Failed to create game server')
    }
  }
}
