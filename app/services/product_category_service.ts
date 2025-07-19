import ProductCategory from '#models/product_category'
import NotFoundException from '#exceptions/not_found_exception'
import logger from '@adonisjs/core/services/logger'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'

/**
 * Service pour gérer les catégories de produits
 * Fournit des méthodes pour récupérer toutes les catégories de produits
 * @class ProductCategoryService
 */
export default class ProductCategoryService {
  /**
   * Fonction pour récupérer toutes les catégories de produits
   * @returns {Promise<ProductCategory>} - La catégorie de produit correspondante
   */
  public static async getAllProductCategories(): Promise<ProductCategory[]> {
    try {
      // Récupérer toutes les catégories de produits
      const productCategories: ProductCategory[] = await ProductCategory.all()

      // Vérifier si des catégories de produits ont été trouvées
      if (productCategories.length === 0) {
        throw new NotFoundException('No product categories found')
      }

      return productCategories
    } catch (error: any) {
      logger.error('getAllProductCategories error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch product categories')
    }
  }
}
