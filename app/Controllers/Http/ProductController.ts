import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { GamePaidAndOwnedStatus, ProductCommand, ProductService } from 'App/Services/ProductService'
import Product from 'App/Models/Product'
import { BucketFileCommand } from 'App/Services/CloudStorageS3Service'
import CreateProductValidator from 'App/Validators/Product/CreateProductValidator'
import UpdateProductValidator from 'App/Validators/Product/UpdateProductValidator'
import User from 'App/Models/User'

export default class ProductController {
  private async createProduct({ request, response }: HttpContextContract): Promise<void> {
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

  private async getProductById({ params, response }: HttpContextContract): Promise<void> {
    const product: Product = await ProductService.getProductById(params.id)
    return product ? response.status(200).json(product) : response.notFound()
  }

  private async getAllProducts({ response }: HttpContextContract): Promise<void> {
    const products: Product[] = await ProductService.getAllProducts()
    return response.status(200).json(products)
  }

  private async getProductByName({ params, response }: HttpContextContract): Promise<void> {
    const product: Product = await ProductService.getProductByName(params.name)
    return product ? response.status(200).json(product) : response.notFound()
  }

  private async updateProduct({ params, request, response }: HttpContextContract): Promise<void> {
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

    const product: Product = await ProductService.updateProduct(
      params.id,
      productCommand,
      bucketFileCommand,
    )
    return response.status(200).json(product)
  }

  private async deleteProduct({ params, response }: HttpContextContract): Promise<void> {
    await ProductService.deleteProduct(params.id)
    return response.noContent()
  }

  private async getGameProductPaidAndOwned({
    params,
    response,
    auth,
  }: HttpContextContract): Promise<void> {
    const user: User = (await auth.authenticate()) as User
    const productGamePaidAndOwnedStatus: GamePaidAndOwnedStatus =
      await ProductService.getGameProductPaidAndOwned(params.gameId, user.id)
    return response.status(200).json(productGamePaidAndOwnedStatus)
  }

  private async getAllGamesProductsPaidAndOwned({
    response,
    auth,
  }: HttpContextContract): Promise<void> {
    const user: User = (await auth.authenticate()) as User
    const gameStatuses: GamePaidAndOwnedStatus[] =
      await ProductService.getAllGamesProductsPaidAndOwned(user.id)
    return response.status(200).json(gameStatuses)
  }
}
