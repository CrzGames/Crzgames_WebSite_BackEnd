import type { HttpContext } from '@adonisjs/core/http'
import CarouselService from '#services/carousel_service'
import type Carousel from '#models/carousel'
import { createCarouselValidator } from '#validators/carousel/create_carousel_validator'
import { updateCarouselValidator } from '#validators/carousel/update_carousel_validator'
import BadRequestException from '#exceptions/bad_request_exception'

/**
 *
 */
type CreateCarouselPayload = {
  title?: string
  content?: string
  button_url?: string
  button_content?: string
  imagePathFilename: string
  imageBucketName: string
  logoPathFilename?: string
  logoBucketName?: string
}

/**
 *
 */
type UpdateCarouselPayload = CreateCarouselPayload & {
  imageFilesId: number
  logoFilesId?: number | null
}

/**
 *
 */
export default class CarouselController {
  /**
   *
   */
  public async getAllCarousels({ response }: HttpContext): Promise<void> {
    const carousels: Carousel[] = await CarouselService.getAllCarousels()
    response.json(carousels)
  }

  /**
   *
   */
  public async getCarouselById({ params, response }: HttpContext): Promise<void> {
    const carouselId: number = Number(params.id)
    if (Number.isNaN(carouselId)) {
      throw new BadRequestException('Invalid carousel id')
    }

    const carousel: Carousel = await CarouselService.getCarouselById(carouselId)
    response.json(carousel)
  }

  /**
   *
   */
  public async createCarousel({ request, response }: HttpContext): Promise<void> {
    const payload: CreateCarouselPayload = await request.validateUsing(createCarouselValidator)

    const carousel: Carousel = await CarouselService.createCarousel(
      payload.title || null,
      payload.content || null,
      payload.button_url || null,
      payload.button_content || null,
      payload.imagePathFilename,
      payload.imageBucketName,
      payload.logoPathFilename || null,
      payload.logoBucketName || null,
    )

    response.ok(carousel)
  }

  /**
   *
   */
  public async updateCarousel({ params, request, response }: HttpContext): Promise<void> {
    const carouselId: number = Number(params.id)
    if (Number.isNaN(carouselId)) {
      throw new BadRequestException('Invalid carousel id')
    }

    const payload: UpdateCarouselPayload = await request.validateUsing(updateCarouselValidator)

    await CarouselService.updateCarousel(
      carouselId,
      payload.title || null,
      payload.content || null,
      payload.button_url || null,
      payload.button_content || null,
      payload.imagePathFilename,
      payload.imageBucketName,
      payload.logoPathFilename || null,
      payload.logoBucketName || null,
      payload.imageFilesId,
      payload.logoFilesId ?? null,
    )

    response.ok({ message: 'Carousel updated successfully' })
  }

  /**
   *
   */
  public async delete({ params, response }: HttpContext): Promise<void> {
    const carouselId: number = Number(params.id)
    if (Number.isNaN(carouselId)) {
      throw new BadRequestException('Invalid carousel id')
    }

    await CarouselService.delete(carouselId)
    response.ok({ message: 'Carousel deleted successfully' })
  }
}
