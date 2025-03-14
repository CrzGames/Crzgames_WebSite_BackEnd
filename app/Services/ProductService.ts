import Product from 'App/Models/Product'
import File from 'App/Models/File'
import CloudStorageS3Service, { BucketFileCommand } from 'App/Services/CloudStorageS3Service'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import UserGameLibrary from 'App/Models/UserGameLibrary'

export type ProductCommand = {
  name: string
  description: string
  image_files_id: number
  games_id: number
  product_categories_id: number
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

export class ProductService {
  // Create a new product
  public static async createProduct(
    productData: ProductCommand,
    bucketFileCommand: BucketFileCommand,
  ): Promise<Product> {
    try {
      // Create the file in the database
      const file: File = await CloudStorageS3Service.createFileInDB(bucketFileCommand)
      productData.image_files_id = file.id

      // Create the product in the database
      return await Product.create({
        ...productData,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Update an existing product
  public static async updateProduct(
    productId: number,
    productData: ProductCommand,
    bucketData: BucketFileCommand,
  ): Promise<Product> {
    const product: Product = await Product.findOrFail(productId)

    try {
      // Update the file in the database
      await CloudStorageS3Service.updateFileInDB(bucketData, productData.image_files_id)

      // Update the product in the database
      product.merge(productData)
      await product.save()
      return product
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Delete a product
  public static async deleteProduct(productId: number): Promise<void> {
    const product: Product = await Product.findOrFail(productId)

    try {
      await product.delete()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Get all products
  public static async getAllProducts(): Promise<Product[]> {
    try {
      return Product.query()
        .preload('imageFile', (imageFileQuery): void => {
          imageFileQuery.preload('bucket')
        })
        .preload('game')
        .preload('productDiscounts')
        .preload('productCategory')
        .preload('gameServers')
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  // Get a single product by ID
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
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  // Get a single product by name
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
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  public static async getProductByGameIdAndProductCategoryGame(
    gameId: number,
  ): Promise<Product | null> {
    try {
      return Product.query()
        .where('games_id', gameId)
        .andWhereHas('productCategory', (queryProductCategory): void => {
          queryProductCategory.where('name', 'game')
        })
        .preload('imageFile')
        .preload('game')
        .preload('productDiscounts')
        .preload('productCategory')
        .preload('gameServers')
        .first()
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  /**
   * Récupère le jeu et check si il est payant et possédé par l'utilisateur
   * @param {number} gameId - L'identifiant du jeu
   * @param {number} userId - L'identifiant de l'utilisateur
   * @returns {Promise<GamePaidAndOwnedStatus>} - Le jeu payant et possédé
   */
  public static async getGameProductPaidAndOwned(
    gameId: number,
    userId: number,
  ): Promise<GamePaidAndOwnedStatus> {
    /**
     * Check si le jeu est considéré comme un produit, si c'est le cas, vérifie si le produit est payant
     */
    const gameProduct: Product | null = await Product.query()
      .where('games_id', gameId)
      .whereHas('productCategory', (queryProductCategory): void => {
        queryProductCategory.where('name', 'game')
      })
      .first()

    /**
     * On vérifie si l'utilisateur possède le jeu
     */
    const userOwnsGame: UserGameLibrary | null = await UserGameLibrary.query()
      .where('users_id', userId)
      .where('games_id', gameId)
      .first()

    /**
     * On détermine si le jeu est payant et possédé par l'utilisateur
     */
    const isPaid: boolean = gameProduct ? gameProduct.price > 0 : false
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
  public static async getAllGamesProductsPaidAndOwned(
    userId: number,
  ): Promise<GamePaidAndOwnedStatus[]> {
    // Récupère tous les produits de catégorie 'game' (jeux payants uniquement)
    const gameProducts: Product[] = await Product.query()
      .whereHas('productCategory', (queryProductCategory) => {
        queryProductCategory.where('name', 'game')
      })
      .select('games_id', 'price')

    // Récupère tous les jeux possédés par l'utilisateur (jeux gratuits et payants)
    const userGamesLibrary: UserGameLibrary[] = await UserGameLibrary.query()
      .where('users_id', userId)
      .select('games_id')

    // Création d'un Set pour savoir quels jeux sont possédés
    const ownedGamesSet: Set<number> = new Set(
      userGamesLibrary.map((userGameLibrary: UserGameLibrary): number => userGameLibrary.games_id),
    )

    // Création d'une Map pour stocker les jeux payants trouvés dans `gameProducts`
    const productsMap: Map<number, Product> = new Map(
      gameProducts
        .filter((product): product is Product & { games_id: number } => product.games_id !== null)
        .map((product) => [product.games_id, product]),
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
        isPaid: product ? product.price > 0 : false, // Si pas trouvé dans productsMap, alors jeu gratuit
        isOwned: ownedGamesSet.has(gameId), // Vérifie si le jeu est possédé
      } as GamePaidAndOwnedStatus
    })
  }
}
