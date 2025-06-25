import { HttpContext } from '@adonisjs/core/http'
import CarouselService from '#services/carousel_service'
import Carousel from '#models/carousel'
import CreateCarouselValidator from '#validators/carousel/create_carousel_validator'
import UpdateCarouselValidator from '#validators/carousel/update_carousel_validator'

export default class CarouselController {
  public async getAllCarousels({ response }: HttpContext): Promise<void> {
    const carousels: Carousel[] = await CarouselService.getAllCarousels()
    return response.json(carousels)
  }

  public async getCarouselById({ params, response }: HttpContext): Promise<void> {
    const carousel: Carousel = await CarouselService.getCarouselById(params.id)
    return response.json(carousel)
  }

  public async createCarousel({ request, response }: HttpContext): Promise<void> {
    const payload = await request.validate(CreateCarouselValidator)

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

    return response.ok(carousel)
  }

  public async updateCarousel({ params, request, response }: HttpContext): Promise<void> {
    const payload = await request.validate(UpdateCarouselValidator)

    await CarouselService.updateCarousel(
      params.id,
      payload.title || null,
      payload.content || null,
      payload.button_url || null,
      payload.button_content || null,
      payload.imagePathFilename,
      payload.imageBucketName,
      payload.logoPathFilename || null,
      payload.logoBucketName || null,
      payload.imageFilesId,
      null, // FIXME: il faudrait s'en douter changer le validator pour qu'il accepte un logoFilesId
    )

    return response.ok({ message: 'Carousel updated successfully' })
  }

  public async delete({ params, response }: HttpContext): Promise<void> {
    await CarouselService.delete(params.id)
    return response.ok({ message: 'Carousel deleted successfully' })
  }
}
