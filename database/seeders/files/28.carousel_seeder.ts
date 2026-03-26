import { BaseSeeder } from '@adonisjs/lucid/seeders'
import path from 'path'
import logger from '@adonisjs/core/services/logger'
import File from '#models/file'
import CloudStorageS3Service from '#services/cloud_storage_s3_service'
import Carousel from '#models/carousel'
import env from '#start/env'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    const assetsBasePath: string = path.resolve('database/seeders/assets-bucket-s3/CarouselSeeder/')
    const bucketNameBase: string = env.get('S3_BUCKET_NAME')

    logger.info('CarouselSeeder : ')

    const fakeCarousel = [
      {
        title: 'Extension TITANS disponible dès maintenant',
        content: 'Le pouvoir des dieux est à portée de main !',
        button_content: 'J’achète',
        button_url: 'http://localhost:1450/news',
        logoFile: path.join(assetsBasePath, 'wow-logo.webp'),
        imageFile: path.join(assetsBasePath, 'image1.webp'),
      },
      {
        title: 'Incarnez un chevalier ou une chevalière de sang',
        content: null,
        button_content: 'En savoir plus',
        button_url: 'http://localhost:1450/news',
        logoFile: path.join(assetsBasePath, 'wow-logo.webp'),
        imageFile: path.join(assetsBasePath, 'image2.webp'),
      },
      {
        title: "L'évènement Méfaits et magie est disponible",
        content: 'Jouez au nouveau mode « cache-cache » et obtenez Ana gardienne des âmes !',
        button_content: 'En savoir plus',
        button_url: 'http://localhost:1450/news',
        logoFile: path.join(assetsBasePath, 'wow-logo.webp'),
        imageFile: path.join(assetsBasePath, 'image3.webp'),
      },
    ]

    let index: number = 0

    for (const carouselData of fakeCarousel) {
      const imageFileExtension: string = path.extname(carouselData.imageFile)
      const logoFileExtension: string = path.extname(carouselData.logoFile)

      // Créer les assets dans le bucket S3
      await CloudStorageS3Service.uploadFileOrFolderInBucket({
        pathFilename: 'carousels/images/image-' + index.toString() + imageFileExtension,
        bucketName: bucketNameBase,
        localPath: carouselData.imageFile,
      })

      await CloudStorageS3Service.uploadFileOrFolderInBucket({
        pathFilename: 'carousels/logos/logo-' + index.toString() + logoFileExtension,
        bucketName: bucketNameBase,
        localPath: carouselData.logoFile,
      })

      // Créer un fichier en db associé au fichier précédent dans le bucket
      const imageFile: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: 'carousels/images/image-' + index.toString() + imageFileExtension,
        bucketName: bucketNameBase,
        localPath: carouselData.imageFile,
      })

      const logoFile: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: 'carousels/logos/logo-' + index.toString() + logoFileExtension,
        bucketName: bucketNameBase,
        localPath: carouselData.logoFile,
      })

      await Carousel.create({
        title: carouselData.title,
        content: carouselData.content,
        buttonUrl: carouselData.button_url,
        buttonContent: carouselData.button_content,
        imageFilesId: imageFile.id,
        logoFilesId: logoFile.id,
      })

      index++
    }

    logger.info('CarouselSeeder Finish.')
  }
}
