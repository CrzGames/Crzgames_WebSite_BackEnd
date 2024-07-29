import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CarouselService from 'App/Services/CarouselService'
import Carousel from 'App/Models/Carousel'
import CreateCarouselValidator from 'App/Validators/Carousel/CreateCarouselValidator'
import UpdateCarouselValidator from 'App/Validators/Carousel/UpdateCarouselValidator'

export default class CarouselController {
  private async getAllCarousels({ response }: HttpContextContract): Promise<void> {
    const carousels: Carousel[] = await CarouselService.getAllCarousels()
    return response.json(carousels)
  }

  private async getCarouselById({ params, response }: HttpContextContract): Promise<void> {
    const carousel: Carousel = await CarouselService.getCarouselById(params.id)
    return response.json(carousel)
  }

  private async createCarousel({ request, response }: HttpContextContract): Promise<void> {
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

  private async updateCarousel({ params, request, response }: HttpContextContract): Promise<void> {
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

  private async delete({ params, response }: HttpContextContract): Promise<void> {
    await CarouselService.delete(params.id)
    return response.ok({ message: 'Carousel deleted successfully' })
  }
}
