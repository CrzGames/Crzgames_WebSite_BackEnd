import Product from '#models/product'
import type File from '#models/file'
import CloudStorageS3Service from '#services/cloud_storage_s3_service'
import type { BucketFileCommand } from '#services/cloud_storage_s3_service'
import NotFoundException from '#exceptions/not_found_exception'
import UserGameLibrary from '#models/user_game_library'
import logger from '@adonisjs/core/services/logger'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import { errors as lucidErrors } from '@adonisjs/lucid'
import type { RelationQueryBuilderContract, RelationSubQueryBuilderContract } from '@adonisjs/lucid/types/relations'
import type ProductCategory from '#models/product_category'

/**
 * @typedef {object} ProductCommand
 * @property {string} name - Le nom du produit
 * @property {string} description - La description du produit
 * @property {number} imageFilesId - L'identifiant du fichier image associé au produit
 * @property {number} gamesId - L'identifiant du jeu associé au produit
 * @property {number} productCategoriesId - L'identifiant de la catégorie de produit associée
 * @property {number} price - Le prix du produit
 */
export type ProductCommand = {
  name: string
  description: string
  imageFilesId: number
  gamesId: number
  productCategoriesId: number
  price: number
}

/**
 * @type {object} GamePaidAndOwnedStatus
 * @property {number} gameId - L'identifiant du jeu
 * @property {boolean} isPaid - Si le jeu est payant
 * @property {boolean} isOwned - Si il possède le jeu
 */
export type GamePaidAndOwnedStatus = {
  gameId?: number
  isPaid: boolean
  isOwned: boolean
}

/**
 * Service pour gérer les produits.
 * Fournit des méthodes pour créer, mettre à jour, supprimer et récupérer des produits.
 * @class ProductService
 */
export class ProductService {
  /**
   * Crée un nouveau produit.
   * @param {ProductCommand} productData - Les données du produit à créer.
   * @param {BucketFileCommand} bucketFileCommand - Les données du fichier à associer au produit.
   * @returns {Promise<Product>} - Le produit créé.
   */
  public static async createProduct(
    productData: ProductCommand,
    bucketFileCommand: BucketFileCommand,
  ): Promise<Product> {
    try {
      // Create the file in the database
      const file: File = await CloudStorageS3Service.createFileInDB(bucketFileCommand)
      productData.imageFilesId = file.id

      // Create the product in the database
      return await Product.create({
        ...productData,
        price: productData.price.toString(),
      })
    } catch (error: any) {
      logger.error('createProduct error: ' + error.message)
      throw new InternalServerErrorException('Failed to create product')
    }
  }

  /**
   * Met à jour un produit existant.
   * @param {number} productId - L'ID du produit à mettre à jour.
   * @param {ProductCommand} productData - Les données à mettre à jour pour le produit.
   * @param {BucketFileCommand} bucketData - Les données du fichier à associer au produit.
   * @returns {Promise<Product>} - Le produit mis à jour.
   */
  public static async updateProduct(
    productId: number,
    productData: ProductCommand,
    bucketData: BucketFileCommand,
  ): Promise<Product> {
    try {
      const product: Product = await Product.findOrFail(productId)

      // Update the file in the database
      await CloudStorageS3Service.updateFileInDB(bucketData, productData.imageFilesId)

      // Update the product in the database
      return await product
        .merge({
          ...productData,
          price: productData.price.toString(),
        })
        .save()
    } catch (error: any) {
      logger.error('updateProduct error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Product with ID ${productId} not found`)
      }

      throw new InternalServerErrorException('Failed to update product')
    }
  }

  /**
   * Supprime un produit par son ID.
   * @param {number} productId - L'ID du produit à supprimer.
   * @returns {Promise<void>} - Aucune valeur de retour, mais l'opération peut échouer avec une exception.
   * @throws {BadRequestException} Si la suppression échoue.
   */
  public static async deleteProduct(productId: number): Promise<void> {
    try {
      const product: Product = await Product.findOrFail(productId)
      await product.delete()
    } catch (error: any) {
      logger.error('deleteProduct error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Product with ID ${productId} not found`)
      }

      throw new InternalServerErrorException('Failed to delete product')
    }
  }

  /**
   * Récupère tous les produits.
   * @returns {Promise<Product[]>} - Retourne une liste de tous les produits.
   */
  public static async getAllProducts(): Promise<Product[]> {
    try {
      return Product.query()
        .preload('imageFile', (imageFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
          imageFileQuery.preload('bucket')
        })
        .preload('game')
        .preload('productDiscounts')
        .preload('productCategory')
        .preload('gameServers')
    } catch (error: any) {
      logger.error('getAllProducts error: ' + error.message)
      throw new InternalServerErrorException('Failed to fetch all products')
    }
  }

  /**
   * Récupère un produit par son ID.
   * @param {number} productId - L'ID du produit à récupérer.
   * @returns {Promise<Product>} - Le produit correspondant.
   */
  public static async getProductById(productId: number): Promise<Product> {
    try {
      return Product.query()
        .where('id', productId)
        .preload('imageFile')
        .preload('game')
        .preload('productDiscounts')
        .preload('productCategory')
        .preload('gameServers')
        .firstOrFail()
    } catch (error: any) {
      logger.error('getProductById error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Product with ID ${productId} not found`)
      }

      throw new InternalServerErrorException('Failed to fetch product by ID')
    }
  }

  /**
   * Récupère un produit par son nom.
   * @param {string} productName - Le nom du produit à récupérer.
   * @returns {Promise<Product>} - Le produit correspondant.
   * @throws {NotFoundException} Si le produit n'est pas trouvé.
   */
  public static async getProductByName(productName: string): Promise<Product> {
    try {
      return Product.query()
        .where('name', productName)
        .preload('imageFile')
        .preload('game')
        .preload('productDiscounts')
        .preload('productCategory')
        .preload('gameServers')
        .firstOrFail()
    } catch (error: any) {
      logger.error('getProductByName error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Product with name ${productName} not found`)
      }

      throw new InternalServerErrorException('Failed to fetch product by name')
    }
  }

  /**
   * Récupère un produit par l'ID du jeu et la catégorie de produit 'game'.
   * @param {number} gameId - L'identifiant du jeu.
   * @returns {Promise<Product | null>} - Le produit correspondant ou null si non trouvé.
   * @throws {NotFoundException} Si le produit n'est pas trouvé.
   */
  public static async getProductByGameIdAndProductCategoryGame(gameId: number): Promise<Product | null> {
    try {
      return Product.query()
        .where('gamesId', gameId)
        .andWhereHas(
          'productCategory',
          (queryProductCategory: RelationSubQueryBuilderContract<typeof ProductCategory>): void => {
            queryProductCategory.where('name', 'game')
          },
        )
        .preload('imageFile')
        .preload('game')
        .preload('productDiscounts')
        .preload('productCategory')
        .preload('gameServers')
        .first()
    } catch (error: any) {
      logger.error('getProductByGameIdAndProductCategoryGame error: ' + error.message)

      throw new InternalServerErrorException('Failed to fetch product by game ID and product category')
    }
  }

  /**
   * Récupère le jeu et check si il est payant et possédé par l'utilisateur
   * @param {number} gameId - L'identifiant du jeu
   * @param {number} userId - L'identifiant de l'utilisateur
   * @returns {Promise<GamePaidAndOwnedStatus>} - Le jeu payant et possédé
   */
  public static async getGameProductPaidAndOwned(gameId: number, userId: number): Promise<GamePaidAndOwnedStatus> {
    /**
     * Check si le jeu est considéré comme un produit, si c'est le cas, vérifie si le produit est payant
     */
    const gameProduct: Product | null = await Product.query()
      .where('gamesId', gameId)
      .whereHas(
        'productCategory',
        (queryProductCategory: RelationSubQueryBuilderContract<typeof ProductCategory>): void => {
          queryProductCategory.where('name', 'game')
        },
      )
      .first()

    /**
     * On vérifie si l'utilisateur possède le jeu
     */
    const userOwnsGame: UserGameLibrary | null = await UserGameLibrary.query()
      .where('usersId', userId)
      .where('gamesId', gameId)
      .first()

    /**
     * On détermine si le jeu est payant et possédé par l'utilisateur
     */
    const isPaid: boolean = gameProduct ? Number(gameProduct.price) > 0 : false
    const isOwned: boolean = !!userOwnsGame

    // On retourne le résultat
    return {
      isPaid,
      isOwned,
    } as GamePaidAndOwnedStatus
  }

  /**
   * Récupère tous les jeux et vérifie s'ils sont payants et possédés par l'utilisateur
   * @param {number} userId - L'identifiant de l'utilisateur
   * @returns {Promise<GamePaidAndOwnedStatus[]>} - Liste de tous les jeux avec leur statut payant et possédé
   */
  public static async getAllGamesProductsPaidAndOwned(userId: number): Promise<GamePaidAndOwnedStatus[]> {
    // Récupère tous les produits de catégorie 'game' (jeux payants uniquement)
    const gameProducts: Product[] = await Product.query()
      .whereHas('productCategory', (queryProductCategory: RelationSubQueryBuilderContract<typeof ProductCategory>) => {
        queryProductCategory.where('name', 'game')
      })
      .select('gamesId', 'price')

    // Récupère tous les jeux possédés par l'utilisateur (jeux gratuits et payants)
    const userGamesLibrary: UserGameLibrary[] = await UserGameLibrary.query().where('usersId', userId).select('gamesId')

    // Création d'un Set pour savoir quels jeux sont possédés
    const ownedGamesSet: Set<number> = new Set(
      userGamesLibrary
        .map((userGameLibrary: UserGameLibrary): number | null => userGameLibrary.gamesId)
        .filter((gameId: number | null): gameId is number => gameId !== null),
    )

    // Création d'une Map pour stocker les jeux payants trouvés dans `gameProducts`
    const productsMap: Map<number, Product> = new Map(
      gameProducts
        .filter((product: Product): product is Product & { gamesId: number } => product.gamesId !== null)
        .map((product: Product & { gamesId: number }) => [product.gamesId, product]),
    )

    // Récupération de **tous** les games_id possibles (payants et gratuits)
    const allGameIds: Set<number> = new Set([
      ...productsMap.keys(), // Jeux payants trouvés dans `gameProducts`
      ...ownedGamesSet, // Jeux possédés (gratuits ou payants)
    ])

    // Création d'un tableau de GamePaidAndOwnedStatus pour chaque jeu
    return Array.from(allGameIds).map((gameId: number): GamePaidAndOwnedStatus => {
      const product: Product | undefined = productsMap.get(gameId) // Récupère le produit s'il existe (sinon undefined)
      return {
        gameId,
        isPaid: product ? Number(product.price) > 0 : false, // Si pas trouvé dans productsMap, alors jeu gratuit
        isOwned: ownedGamesSet.has(gameId), // Vérifie si le jeu est possédé
      } as GamePaidAndOwnedStatus
    })
  }
}
