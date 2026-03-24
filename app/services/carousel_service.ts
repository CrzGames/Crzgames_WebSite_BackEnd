import Carousel from '#models/carousel'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import CloudStorageS3Service from '#services/cloud_storage_s3_service'
import type { BucketFileCommand } from '#services/cloud_storage_s3_service'
import type File from '#models/file'
import type { RelationQueryBuilderContract } from '@adonisjs/lucid/types/relations'
import logger from '@adonisjs/core/services/logger'
import { errors as lucidErrors } from '@adonisjs/lucid'

/**
 * Service pour gérer les carrousels
 * @class CarouselService
 */
export default class CarouselService {
  /**
   * Récupère tous les carrousels
   * @returns {Promise<Carousel[]>} - Une promesse qui résout avec la liste de tous les carrousels
   */
  public static async getAllCarousels(): Promise<Carousel[]> {
    try {
      // Récupération de tous les carrousels avec leur relation vers les fichiers d'image et de logo
      const carousels: Carousel[] = await Carousel.query()
        .preload('imageFile', (imageFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
          imageFileQuery.preload('bucket')
        })
        .preload('logoFile', (logoFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
          logoFileQuery.preload('bucket')
        })

      return carousels
    } catch (error) {
      logger.error('getAllCarousels error: ' + error.message)

      throw new InternalServerErrorException('Failed to fetch all carousels')
    }
  }

  /**
   * Récupère un carrousel par son ID
   * @param {number} id - L'ID du carrousel à récupérer
   * @returns {Promise<Carousel>} - Une promesse qui résout avec le carrousel correspondant
   */
  public static async getCarouselById(id: number): Promise<Carousel> {
    try {
      // Récupération du carrousel par son ID avec les relations vers les fichiers d'image et de logo
      return await Carousel.query()
        .preload('imageFile', (imageFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
          imageFileQuery.preload('bucket')
        })
        .preload('logoFile', (logoFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
          logoFileQuery.preload('bucket')
        })
        .where('id', id)
        .firstOrFail()
    } catch (error) {
      logger.error('getCarouselById error: ' + error.message)

      // Carrousel non trouvé dans la base de données
      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('Carousel not found with ID: ' + id)
      }

      // Erreur inattendue (base de données, etc.)
      throw new InternalServerErrorException('Failed to fetch carousel by id')
    }
  }

  /**
   * Crée un nouveau carrousel
   * @param {string | null} title - Le titre du carrousel
   * @param {string | null} content - Le contenu du carrousel
   * @param {string | null} button_url - L'URL du bouton du carrousel
   * @param {string | null} button_content - Le contenu du bouton du carrousel
   * @param {string} imagePathFilename - Le chemin et le nom de fichier de l'image du carrousel
   * @param {string} imageBucketName - Le nom du bucket pour l'image du carrousel
   * @param {string | null} logoPathFilename - Le chemin et le nom de fichier du logo du carrousel (optionnel)
   * @param {string | null} logoBucketName - Le nom du bucket pour le logo du carrousel (optionnel)
   * @returns {Promise<Carousel>} - Une promesse qui résout avec le nouveau carrousel créé
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
      // Si un logo est fourni pour le carousel, créer un objet BucketFileCommand pour le logo du carrousel
      let carouselLogoFile: BucketFileCommand | undefined = undefined
      if (logoPathFilename && logoBucketName) {
        carouselLogoFile = {
          pathFilename: logoPathFilename,
          bucketName: logoBucketName,
        }
      }

      // Créer un objet BucketFileCommand pour l'image du carrousel
      const carouselImageFile: BucketFileCommand = {
        pathFilename: imagePathFilename,
        bucketName: imageBucketName,
      }

      // Créer une entrée en base de données pour l'image du carrousel
      const carouselImageFileInstance: File = await CloudStorageS3Service.createFileInDB(carouselImageFile)

      // Si un logo est fourni, créer une entrée en base de données pour le logo du carrousel
      let carouselLogoFileInstance: File | undefined
      if (carouselLogoFile) {
        carouselLogoFileInstance = await CloudStorageS3Service.createFileInDB(carouselLogoFile)
      }

      // Créer le carrousel dans la base de données avec les informations fournies
      return await Carousel.create({
        title: title,
        content: content,
        buttonUrl: button_url,
        buttonContent: button_content,
        imageFilesId: carouselImageFileInstance.id,
        logoFilesId: carouselLogoFileInstance?.id ? carouselLogoFileInstance.id : null,
      })
    } catch (error: any) {
      logger.error('createCarousel error: ' + error.message)

      // Si une erreur inattendue se produit, lancer une exception interne du serveur
      throw new InternalServerErrorException('Failed to create carousel')
    }
  }

  /**
   * Met à jour un carrousel existant
   * @param {number} id - L'ID du carrousel à mettre à jour
   * @param {string | null} title - Le nouveau titre du carrousel
   * @param {string | null} content - Le nouveau contenu du carrousel
   * @param {string | null} button_url - La nouvelle URL du bouton du carrousel
   * @param {string | null} button_content - Le nouveau contenu du bouton du carrousel
   * @param {string} imagePathFilename - Le chemin et le nom de fichier de la nouvelle image du carrousel
   * @param {string} imageBucketName - Le nom du bucket pour la nouvelle image du carrousel
   * @param {string | null} logoPathFilename - Le chemin et le nom de fichier du nouveau logo du carrousel (optionnel)
   * @param {string | null} logoBucketName - Le nom du bucket pour le nouveau logo du carrousel (optionnel)
   * @param {number} image_files_id - L'ID du fichier d'image existant dans la base de données
   * @param {number | null} logo_files_id - L'ID du fichier de logo existant dans la base de données (optionnel)
   * @returns {Promise<void>} - Une promesse qui résout lorsque le carrousel est mis à jour
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
    try {
      // Récupération du carrousel par son ID
      const carousel: Carousel = await Carousel.findOrFail(id)

      // Créer un objet BucketFileCommand pour l'image du carrousel et mettre à jour l'entrée en base de données
      const carouselImageFile: BucketFileCommand = {
        pathFilename: imagePathFilename,
        bucketName: imageBucketName,
      }
      await CloudStorageS3Service.updateFileInDB(carouselImageFile, image_files_id)

      // Si un logo est fourni, met à jour le fichier existant ou en crée un nouveau.
      let nextLogoFilesId: number | null = logo_files_id
      if (logoPathFilename && logoBucketName) {
        const carouselLogoFile: BucketFileCommand = {
          pathFilename: logoPathFilename,
          bucketName: logoBucketName,
        }

        if (nextLogoFilesId) {
          await CloudStorageS3Service.updateFileInDB(carouselLogoFile, nextLogoFilesId)
        } else {
          const carouselLogoFileInstance: File = await CloudStorageS3Service.createFileInDB(carouselLogoFile)
          nextLogoFilesId = carouselLogoFileInstance.id
        }
      }

      // Mettre à jour les informations du carrousel actuelle dans la base de données
      await carousel
        .merge({
          title: title,
          content: content,
          buttonUrl: button_url,
          buttonContent: button_content,
          imageFilesId: image_files_id,
          logoFilesId: nextLogoFilesId,
        })
        .save()
    } catch (error: any) {
      logger.error('updateCarousel error: ' + error.message)

      // Carrousel non trouvé dans la base de données
      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('Carousel not found with ID: ' + id)
      }

      // Erreur inattendue (base de données, etc.)
      throw new InternalServerErrorException('Failed to update carousel')
    }
  }

  /**
   * Supprime un carrousel par son ID
   * @param {number} id - L'ID du carrousel à supprimer
   * @returns {Promise<void>} - Une promesse qui résout lorsque le carrousel est supprimé
   */
  public static async delete(id: number): Promise<void> {
    try {
      // Récupération du carrousel par son ID
      const carousel: Carousel = await Carousel.findOrFail(id)

      // Suppression du carrousel de la base de données
      await carousel.delete()
    } catch (error: any) {
      logger.error('deleteCarousel error: ' + error.message)

      // Carrousel non trouvé dans la base de données
      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('Carousel not found with ID: ' + id)
      }

      // Erreur inattendue (base de données, etc.)
      throw new InternalServerErrorException('Failed to delete carousel')
    }
  }
}
