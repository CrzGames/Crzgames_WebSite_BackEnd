import ProductGameServer from '#models/product_game_server'
import logger from '@adonisjs/core/services/logger'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'

/**
 * Service pour gérer les serveurs de jeux associés aux produits.
 * Fournit des méthodes pour récupérer tous les serveurs de jeux associés aux produits et créer un nouveau serveur de jeu associé à un produit.
 * @class ProductGameServerService
 */
export default class ProductGameServerService {
  /**
   * Récupère tous les serveurs de jeux associés aux produits.
   * @returns {Promise<ProductGameServer[]>} - Un tableau de tous les serveurs de jeux associés aux produits.
   */
  public static async getAllProductGameServers(): Promise<ProductGameServer[]> {
    try {
      return await ProductGameServer.query().preload('product').preload('gameServer')
    } catch (error: any) {
      logger.error('getAllProductGameServers error: ' + error.message)
      throw new InternalServerErrorException('Failed to fetch product game servers')
    }
  }

  /**
   * Crée un nouveau serveur de jeu associé à un produit.
   * @param {number} productId - L'ID du produit auquel le serveur de jeu est associé.
   * @param {number} gameServerId - L'ID du serveur de jeu à associer au produit.
   * @returns {Promise<ProductGameServer>} - Le serveur de jeu associé au produit créé.
   */
  public static async createProductGameServer(productId: number, gameServerId: number): Promise<ProductGameServer> {
    try {
      return await ProductGameServer.create({
        products_id: productId,
        game_servers_id: gameServerId,
      })
    } catch (error: any) {
      logger.error('createProductGameServer error: ' + error.message)
      throw new InternalServerErrorException('Failed to create product game server')
    }
  }
}
