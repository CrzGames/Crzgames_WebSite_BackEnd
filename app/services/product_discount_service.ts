import ProductDiscount from '#models/product_discount'
import NotFoundException from '#exceptions/not_found_exception'
import logger from '@adonisjs/core/services/logger'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import { errors as lucidErrors } from '@adonisjs/lucid'

/**
 * Type pour les réductions de produits.
 * @typedef {object} ProductDiscountCommand
 * @property {number} products_id - L'ID du produit associé.
 * @property {string} currency - La devise de la réduction.
 * @property {number} discount_percent - Le pourcentage de réduction appliqué au produit.
 */
export type ProductDiscountCommand = {
  products_id: number
  currency: string
  discount_percent: number
}

/**
 * Service pour gérer les réductions de produits.
 * Fournit des méthodes pour créer, mettre à jour, supprimer et récupérer des réductions de produits.
 * @class ProductDiscountService
 */
export class ProductDiscountService {
  /**
   * Crée une nouvelle réduction de produit.
   * @param {ProductDiscountCommand} data - Les données de la réduction de produit à créer.
   * @returns {Promise<ProductDiscount>} - La réduction de produit créée.
   */
  public static async createProductDiscount(data: ProductDiscountCommand): Promise<ProductDiscount> {
    try {
      return await ProductDiscount.create(data)
    } catch (error: any) {
      logger.error('createProductDiscount error: ' + error.message)
      throw new InternalServerErrorException('Failed to create product discount')
    }
  }

  /**
   * Met à jour une réduction de produit existante.
   * @param {number} id - L'ID de la réduction de produit à mettre à jour.
   * @param {ProductDiscountCommand} data - Les données à mettre à jour pour la réduction de produit.
   * @returns {Promise<ProductDiscount>} - La réduction de produit mise à jour.
   */
  public static async updateProductDiscount(id: number, data: ProductDiscountCommand): Promise<ProductDiscount> {
    try {
      const productDiscount: ProductDiscount = await ProductDiscount.findOrFail(id)
      return await productDiscount.merge(data).save()
    } catch (error: any) {
      logger.error('updateProductDiscount error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Product discount with ID ${id} not found`)
      }

      throw new InternalServerErrorException('Failed to update product discount')
    }
  }

  /**
   * Supprime une réduction de produit par son ID.
   * @param {number} id - L'ID de la réduction de produit à supprimer.
   * @returns {Promise<void>} - Aucune valeur de retour, mais l'opération peut échouer avec une exception.
   */
  public static async deleteProductDiscount(id: number): Promise<void> {
    try {
      const productDiscount: ProductDiscount = await ProductDiscount.findOrFail(id)
      await productDiscount.delete()
    } catch (error: any) {
      logger.error('deleteProductDiscount error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Product discount with ID ${id} not found`)
      }

      throw new InternalServerErrorException('Failed to delete product discount')
    }
  }

  // Get all product discounts for a specific product
  /**
   *
   */
  public static async getAllProductDiscountsByProductId(productId: number): Promise<ProductDiscount[]> {
    try {
      return ProductDiscount.query().where('products_id', productId).preload('product')
    } catch (error: any) {
      logger.error('getAllProductDiscountsByProductId error: ' + error.message)
      throw new InternalServerErrorException(`Failed to fetch product discounts for product ID ${productId}`)
    }
  }

  /**
   * Récupère une réduction de produit par son ID.
   * @param {number} id - L'ID de la réduction de produit à récupérer.
   * @returns {Promise<ProductDiscount | null>} - La réduction de produit correspondante ou null si non trouvée.
   */
  public static async getProductDiscountById(id: number): Promise<ProductDiscount | null> {
    try {
      return ProductDiscount.query().where('id', id).preload('product').firstOrFail()
    } catch (error: any) {
      logger.error('getProductDiscountById error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Product discount with ID ${id} not found`)
      }

      throw new InternalServerErrorException('Failed to fetch product discount by ID')
    }
  }
}
