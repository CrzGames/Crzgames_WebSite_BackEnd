import type { HttpContext } from '@adonisjs/core/http'
import { ProductService } from '#services/product_service'
import type { ProductCommand, GamePaidAndOwnedStatus } from '#services/product_service'
import type Product from '#models/product'
import type { BucketFileCommand } from '#services/cloud_storage_s3_service'
import type User from '#models/user'
import { createProductValidator } from '#validators/Product/CreateProductValidator'
import { updateProductValidator } from '#validators/Product/UpdateProductValidator'

export default class ProductController {
  public async createProduct({ request, response }: HttpContext): Promise<void> {
    const payload: {
      name: string
      description: string
      games_id: number
      price: number
      bucket_name: string
      pathFilename: string
      product_categories_id: number
    } = await request.validateUsing(createProductValidator)

    const bucketFileCommand: BucketFileCommand = {
      bucketName: payload.bucket_name,
      pathFilename: payload.pathFilename,
    }
    const productCommand: ProductCommand = {
      name: payload.name,
      description: payload.description,
      gamesId: payload.games_id,
      price: payload.price,
      imageFilesId: -1,
      productCategoriesId: payload.product_categories_id,
    }

    const product: Product = await ProductService.createProduct(productCommand, bucketFileCommand)
    return response.created(product)
  }

  public async getProductById({ params, response }: HttpContext): Promise<void> {
    const product: Product = await ProductService.getProductById(params.id)
    return product ? response.status(200).json(product) : response.notFound()
  }

  public async getAllProducts({ response }: HttpContext): Promise<void> {
    const products: Product[] = await ProductService.getAllProducts()
    return response.status(200).json(products)
  }

  public async getProductByName({ params, response }: HttpContext): Promise<void> {
    const product: Product = await ProductService.getProductByName(params.name)
    return product ? response.status(200).json(product) : response.notFound()
  }

  public async updateProduct({ params, request, response }: HttpContext): Promise<void> {
    const payload: {
      name: string
      description: string
      games_id: number
      price: number
      bucket_name: string
      pathFilename: string
      image_files_id: number
      product_categories_id: number
    } = await request.validateUsing(updateProductValidator)

    const bucketFileCommand: BucketFileCommand = {
      bucketName: payload.bucket_name,
      pathFilename: payload.pathFilename,
    }
    const productCommand: ProductCommand = {
      name: payload.name,
      description: payload.description,
      gamesId: payload.games_id,
      price: payload.price,
      imageFilesId: payload.image_files_id,
      productCategoriesId: payload.product_categories_id,
    }

    const product: Product = await ProductService.updateProduct(params.id, productCommand, bucketFileCommand)
    return response.status(200).json(product)
  }

  public async deleteProduct({ params, response }: HttpContext): Promise<void> {
    await ProductService.deleteProduct(params.id)
    return response.noContent()
  }

  public async getGameProductPaidAndOwned({ params, response, auth }: HttpContext): Promise<void> {
    const user: User = (await auth.authenticate()) as User
    const productGamePaidAndOwnedStatus: GamePaidAndOwnedStatus = await ProductService.getGameProductPaidAndOwned(
      params.gameId,
      user.id,
    )
    return response.status(200).json(productGamePaidAndOwnedStatus)
  }

  public async getAllGamesProductsPaidAndOwned({ response, auth }: HttpContext): Promise<void> {
    const user: User = (await auth.authenticate()) as User
    const gameStatuses: GamePaidAndOwnedStatus[] = await ProductService.getAllGamesProductsPaidAndOwned(user.id)
    return response.status(200).json(gameStatuses)
  }
}
