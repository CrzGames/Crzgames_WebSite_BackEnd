import Order from '#models/order'
import NotFoundException from '#exceptions/not_found_exception'
import { errors as lucidErrors } from '@adonisjs/lucid'
import logger from '@adonisjs/core/services/logger'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'

/**
 * Type pour les commandes de produits de commande.
 * @typedef {object} OrderCommand
 * @property {number} [users_id] - L'ID de l'utilisateur associé à la commande.
 * @property {string} [currency] - La devise de la commande.
 * @property {'Paid' | 'Canceled' | 'Failed'} [status_order] - Le statut de la commande.
 * @property {number} [total_price] - Le prix total de la commande.
 */
export type OrderCommand = {
  users_id?: number
  currency?: string
  status_order?: 'Paid' | 'Canceled' | 'Failed'
  total_price?: number
}

/**
 * Service pour gérer les commandes.
 * Fournit des méthodes pour créer, mettre à jour, supprimer et récupérer des commandes.
 * @class OrderService
 */
export class OrderService {
  /**
   * Crée une nouvelle commande.
   * @param {OrderCommand} data - Les données de la commande à créer.
   * @returns {Promise<Order[]>} - Un tableau de toutes les commandes.
   */
  public static async createOrder(data: OrderCommand): Promise<Order> {
    try {
      return await Order.create(data)
    } catch (error: any) {
      logger.error('createOrder error: ' + error.message)

      throw new InternalServerErrorException('Failed to create order')
    }
  }

  /**
   * Met à jour une commande existante.
   * @param {number} id - L'ID de la commande à mettre à jour.
   * @param {OrderCommand} data - Les données à mettre à jour pour la commande.
   * @returns {Promise<Order>} - La commande mise à jour.
   */
  public static async updateOrder(id: number, data: OrderCommand): Promise<Order> {
    try {
      const order: Order = await Order.findOrFail(id)
      return await order.merge(data).save()
    } catch (error) {
      logger.error('updateOrder error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Order with ID ${id} not found`)
      }

      throw new InternalServerErrorException('Failed to update order')
    }
  }

  /**
   * Supprime une commande par son ID.
   * @param {number} id - L'ID de la commande à supprimer.
   * @returns {Promise<void>} - Aucune valeur de retour.
   * @throws {BadRequestException} Si la suppression échoue.
   */
  public static async deleteOrder(id: number): Promise<void> {
    try {
      const order: Order = await Order.findOrFail(id)
      await order.delete()
    } catch (error: any) {
      logger.error('deleteOrder error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Order with ID ${id} not found`)
      }

      throw new InternalServerErrorException('Failed to delete order')
    }
  }

  /**
   * Récupère toutes les commandes associées à un utilisateur spécifique.
   * @param {number} userId - L'ID de l'utilisateur pour lequel récupérer les commandes.
   * @returns {Promise<Order[]>} - Un tableau de toutes les commandes associées à l'utilisateur.
   */
  public static async getAllOrdersByUserId(userId: number): Promise<Order[]> {
    try {
      return Order.query().where('users_id', userId).preload('user')
    } catch (error: any) {
      logger.error('getAllOrdersByUserId error: ' + error.message)

      throw new InternalServerErrorException('Failed to fetch orders for user')
    }
  }

  /**
   * Récupère une commande par son ID.
   * @param {number} id - L'ID de la commande à récupérer.
   * @returns {Promise<Order | null>} - La commande correspondante ou null si non trouvée.
   */
  public static async getOrderById(id: number): Promise<Order | null> {
    try {
      return Order.query().where('id', id).preload('user').firstOrFail()
    } catch (error: any) {
      logger.error('getOrderById error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Order with ID ${id} not found`)
      }

      throw new InternalServerErrorException('Failed to fetch order by ID')
    }
  }
}
