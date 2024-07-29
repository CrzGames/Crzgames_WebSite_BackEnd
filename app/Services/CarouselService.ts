import Carousel from 'App/Models/Carousel'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import CloudStorageS3Service, { BucketFileCommand } from 'App/Services/CloudStorageS3Service'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import File from 'App/Models/File'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

export default class CarouselService {
  /**
   * Fetch all carousels
   */
  public static async getAllCarousels(): Promise<Carousel[]> {
    try {
      const carousels: Carousel[] = await Carousel.query()
        .preload('imageFile', (imageFileQuery): void => {
          imageFileQuery.preload('bucket')
        })
        .preload('logoFile', (logoFileQuery): void => {
          logoFileQuery.preload('bucket')
        })

      if (!carousels || carousels.length === 0) {
        throw new NotFoundException('No carousels found')
      }

      return carousels
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  /**
   * Fetch a specific carousel by its ID
   */
  public static async getCarouselById(id: number): Promise<Carousel> {
    try {
      return await Carousel.query()
        .preload('imageFile', (imageFileQuery): void => {
          imageFileQuery.preload('bucket')
        })
        .preload('logoFile', (logoFileQuery): void => {
          logoFileQuery.preload('bucket')
        })
        .where('id', id)
        .firstOrFail()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  /**
   * Create a new carousel
   */
  public static async createCarousel(
    title: string | null,
    content: string | null,
    button_url: string | null,
    button_content: string | null,
    imagePathFilename: string,
    imageBucketName: string,
    logoPathFilename: string | null,
    logoBucketName: string | null,
  ): Promise<Carousel> {
    try {
      const carouselImageFile: BucketFileCommand = {
        pathFilename: imagePathFilename,
        bucketName: imageBucketName,
      }

      let carouselLogoFile: BucketFileCommand | undefined
      if (logoPathFilename && logoBucketName) {
        carouselLogoFile = {
          pathFilename: logoPathFilename,
          bucketName: logoBucketName,
        }
      }

      const carouselImageFileInstance: File =
        await CloudStorageS3Service.createFileInDB(carouselImageFile)

      let carouselLogoFileInstance: File | undefined
      if (carouselLogoFile) {
        carouselLogoFileInstance = await CloudStorageS3Service.createFileInDB(carouselLogoFile)
      }

      return await Carousel.create({
        title: title,
        content: content,
        button_url: button_url,
        button_content: button_content,
        image_files_id: carouselImageFileInstance.id,
        logo_files_id: carouselLogoFileInstance?.id ? carouselLogoFileInstance.id : null,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  /**
   * Update a specific carousel by its ID
   */
  public static async updateCarousel(
    id: number,
    title: string | null,
    content: string | null,
    button_url: string | null,
    button_content: string | null,
    imagePathFilename: string,
    imageBucketName: string,
    logoPathFilename: string | null,
    logoBucketName: string | null,
    image_files_id: number,
    logo_files_id: number | null,
  ): Promise<void> {
    const carousel: Carousel = await Carousel.findOrFail(id)

    try {
      const carouselImageFile: BucketFileCommand = {
        pathFilename: imagePathFilename,
        bucketName: imageBucketName,
      }
      await CloudStorageS3Service.updateFileInDB(carouselImageFile, image_files_id)

      let carouselLogoFile: BucketFileCommand | undefined
      if (logoPathFilename && logoBucketName && logo_files_id) {
        carouselLogoFile = {
          pathFilename: logoPathFilename,
          bucketName: logoBucketName,
        }
        await CloudStorageS3Service.updateFileInDB(carouselLogoFile, logo_files_id)
      }

      // Updating in database
      await carousel
        .merge({
          title: title,
          content: content,
          button_url: button_url,
          button_content: button_content,
          image_files_id: image_files_id,
          logo_files_id: logo_files_id,
        })
        .save()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  /**
   * Delete a specific carousel by its ID
   */
  public static async delete(id: number): Promise<void> {
    const carousel: Carousel = await Carousel.findOrFail(id)

    try {
      await carousel.delete()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
