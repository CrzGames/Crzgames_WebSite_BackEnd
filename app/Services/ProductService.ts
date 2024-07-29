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
 * @property {boolean} isPaid - Si le jeu est payant
 * @property {boolean} isOwned - Si il possède le jeu
 */
export type GamePaidAndOwnedStatus = {
  isPaid: boolean;
  isOwned: boolean;
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

  public static async getProductByGameIdAndProductCategoryGame(gameId: number): Promise<Product | null> {
    try {
      return Product.query()
        .where('games_id', gameId)
        .andWhereHas('productCategory', (queryProductCategory): void => {
          queryProductCategory.where('name', 'game');
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

  // Check if the game is paid and owned
  public static async isGamePaidAndOwned(gameId: number, userId: number): Promise<GamePaidAndOwnedStatus> {
    // Check if the product with the gameId exists and if the product category is 'games'
    const product: Product | null = await Product.query()
      .where('games_id', gameId)
      .whereHas('productCategory', (queryProductCategory): void => {
        queryProductCategory.where('name', 'game');
      })
      .first();

    // Check if the user owns the game
    const userOwnsGame: UserGameLibrary | null = await UserGameLibrary.query()
      .where('users_id', userId)
      .where('games_id', gameId)
      .first();

    // Determine if the game is paid and owned
    const isPaid: boolean = product ? product.price > 0 : false;
    const isOwned: boolean = !!userOwnsGame;

    return {
      isPaid,
      isOwned,
    } as GamePaidAndOwnedStatus
  }
}
