import { HttpContext } from '@adonisjs/core/http'
import { GamePaidAndOwnedStatus, ProductCommand, ProductService } from '#services/product_service'
import Product from '#models/product'
import { BucketFileCommand } from '#services/cloud_storage_s3_service'
import CreateProductValidator from '#validators/product/create_product_validator'
import UpdateProductValidator from '#validators/product/update_product_validator'
import User from '#models/user'

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
    } = await request.validate(CreateProductValidator)

    const bucketFileCommand: BucketFileCommand = {
      bucketName: payload.bucket_name,
      pathFilename: payload.pathFilename,
    }
    const productCommand: ProductCommand = {
      name: payload.name,
      description: payload.description,
      games_id: payload.games_id,
      price: payload.price,
      image_files_id: -1,
      product_categories_id: payload.product_categories_id,
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
    } = await request.validate(UpdateProductValidator)

    const bucketFileCommand: BucketFileCommand = {
      bucketName: payload.bucket_name,
      pathFilename: payload.pathFilename,
    }
    const productCommand: ProductCommand = {
      name: payload.name,
      description: payload.description,
      games_id: payload.games_id,
      price: payload.price,
      image_files_id: payload.image_files_id,
      product_categories_id: payload.product_categories_id,
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
