import OrderProduct from '#models/order_product'
import NotFoundException from '#exceptions/not_found_exception'
import logger from '@adonisjs/core/services/logger'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import { errors as lucidErrors } from '@adonisjs/lucid'
import type Product from '#models/product'
import type File from '#models/file'
import type { RelationQueryBuilderContract } from '@adonisjs/lucid/types/relations'

/**
 * Un type de commande pour créer ou mettre à jour un produit de commande.
 * @typedef {object} ProductOrderCommand
 * @property {number} orders_id - L'ID de la commande associée.
 * @property {number} products_id - L'ID du produit associé.
 * @property {number} quantity - La quantité de produit commandée.
 * @property {number} [game_servers_id] - L'ID du serveur de jeu associé (optionnel).
 * @property {number} price - Le prix du produit commandé.
 */
export type ProductOrderCommand = {
  orders_id: number
  products_id: number
  quantity: number
  game_servers_id?: number
  price: number
}

/**
 * Un service pour gérer les produits de commande.
 * Ce service fournit des méthodes pour créer, mettre à jour, supprimer et récupérer des produits de commande.
 * @class OrderProductService
 */
export class OrderProductService {
  /**
   * Récupère un produit de commande par son ID.
   * @param {ProductOrderCommand} data - Les données du produit de commande à créer.
   * @returns {Promise<OrderProduct>} - Le produit de commande correspondant à l'ID.
   */
  public static async createOrderProduct(data: ProductOrderCommand): Promise<OrderProduct> {
    try {
      return await OrderProduct.create(data)
    } catch (error: any) {
      logger.error('createOrderProduct error: ' + error.message)
      throw new InternalServerErrorException('Failed to create order product')
    }
  }

  /**
   * Récupère un produit de commande par son ID.
   * @param {number} orderProductId - L'ID du produit de commande à récupérer.
   * @param {Partial<ProductOrderCommand>} data - Les données à mettre à jour pour le produit de commande.
   * @returns {Promise<OrderProduct>} - Le produit de commande correspondant à l'ID.
   */
  public static async updateOrderProduct(
    orderProductId: number,
    data: Partial<ProductOrderCommand>,
  ): Promise<OrderProduct> {
    try {
      const productOrder: OrderProduct = await OrderProduct.findOrFail(orderProductId)
      return await productOrder.merge(data).save()
    } catch (error: any) {
      logger.error('updateOrderProduct error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`OrderProduct with ID ${orderProductId} not found`)
      }

      throw new InternalServerErrorException(`Failed to update order product with ID ${orderProductId}`)
    }
  }

  /**
   * Supprime un produit de commande par son ID.
   * @param {number} orderProductId - L'ID du produit de commande à supprimer.
   * @returns {Promise<void>} - Une promesse qui se résout lorsque le produit de commande est supprimé.
   * @throws {BadRequestException} Si la suppression échoue.
   */
  public static async deleteOrderProduct(orderProductId: number): Promise<void> {
    try {
      const productOrder: OrderProduct = await OrderProduct.findOrFail(orderProductId)
      await productOrder.delete()
    } catch (error: any) {
      logger.error('deleteOrderProduct error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`OrderProduct with ID ${orderProductId} not found`)
      }

      throw new InternalServerErrorException(`Failed to delete order product with ID ${orderProductId}`)
    }
  }

  /**
   * Récupère tous les produits de commande associés à une commande spécifique.
   * @param {number} orderId - L'ID de la commande pour laquelle récupérer les produits de commande.
   * @returns {Promise<OrderProduct[]>} - Un tableau de produits de commande associés à la commande.
   * @throws {NotFoundException} Si aucun produit de commande n'est trouvé pour la commande spécifiée.
   */
  public static async getAllOrderProductsByOrderId(orderId: number): Promise<OrderProduct[]> {
    try {
      return OrderProduct.query()
        .where('orders_id', orderId)
        .preload('product', (queryProduct: RelationQueryBuilderContract<typeof Product, any>): void => {
          queryProduct.preload('imageFile', (queryImageFile: RelationQueryBuilderContract<typeof File, any>): void => {
            queryImageFile.preload('bucket')
          })
        })
        .preload('order')
        .preload('gameServer')
    } catch (error: any) {
      logger.error('getAllOrderProductsByOrderId error: ' + error.message)

      throw new InternalServerErrorException(`Failed to fetch order products for order ID ${orderId}`)
    }
  }

  /**
   * Récupère tous les produits de commande associés à un produit spécifique.
   * @param {number} productId - L'ID du produit pour lequel récupérer les produits de commande.
   * @returns {Promise<OrderProduct[]>} - Un tableau de produits de commande associés au produit.
   * @throws {NotFoundException} Si aucun produit de commande n'est trouvé pour le produit spécifié.
   */
  public static getAllOrderProductsByProductId(productId: number): Promise<OrderProduct[]> {
    try {
      return OrderProduct.query()
        .where('products_id', productId)
        .preload('product', (queryProduct: RelationQueryBuilderContract<typeof Product, any>): void => {
          queryProduct.preload('imageFile', (queryImageFile: RelationQueryBuilderContract<typeof File, any>): void => {
            queryImageFile.preload('bucket')
          })
        })
        .preload('order')
        .preload('gameServer')
    } catch (error: any) {
      logger.error('getAllOrderProductsByProductId error: ' + error.message)

      throw new InternalServerErrorException(`Failed to fetch order products for product ID ${productId}`)
    }
  }
}
