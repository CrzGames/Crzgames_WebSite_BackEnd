import GameBinary from '#models/game_binary'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import CloudStorageS3Service from '#services/cloud_storage_s3_service'
import type { BucketFileCommand } from '#services/cloud_storage_s3_service'
import type File from '#models/file'
import logger from '@adonisjs/core/services/logger'
import { errors as lucidErrors } from '@adonisjs/lucid'
import NotFoundException from '#exceptions/not_found_exception'
import type { RelationQueryBuilderContract } from '@adonisjs/lucid/types/relations'

/**
 * Type pour représenter une commande de création ou de mise à jour d'un binaire de jeu
 * @property {string} pathfilename - Le chemin et le nom du fichier binaire
 * @property {number} platformId - L'ID de la plateforme de jeu associée
 * @property {string} bucketName - Le nom du bucket S3 où le fichier est stocké
 */
export type GameBinaryCommand = {
  pathfilename: string
  platformId: number
  bucketName: string
}

/**
 * Service pour gérer les binaires de jeu
 * Fournit des méthodes pour créer, mettre à jour, récupérer et supprimer des binaires de jeu
 * @class GameBinariesService
 */
export default class GameBinariesService {
  /**
   * Fonction pour créer un binaire de jeu
   * @param {GameBinaryCommand} gameBinaryCommand - La commande contenant les informations du binaire de jeu
   * @returns {Promise<GameBinary>} - Le binaire de jeu créé
   */
  public static async createGameBinary(gameBinaryCommand: GameBinaryCommand): Promise<GameBinary> {
    try {
      // Créer une entrée en base de données pour le fichier binaire du jeu
      const file: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: gameBinaryCommand.pathfilename,
        bucketName: gameBinaryCommand.bucketName,
      })

      // Créer le binaire de jeu dans la base de données avec l'ID de la plateforme et l'ID du fichier
      return await GameBinary.create({
        gamePlatformsId: gameBinaryCommand.platformId,
        filesId: file.id,
      })
    } catch (error: any) {
      logger.error('createGameBinary error: ' + error.message)

      throw new InternalServerErrorException('Failed to create game binary')
    }
  }

  /**
   * Fonction pour créer plusieurs binaires de jeu en parallèle
   * @param {GameBinaryCommand[]} gameBinariesCommand - Un tableau de commandes pour créer des binaires de jeu
   * @returns {Promise<number[]>} - Un tableau des IDs des binaires de jeu créés
   */
  public static async createGameBinaries(gameBinariesCommand: GameBinaryCommand[]): Promise<number[]> {
    try {
      // Map pour transformer chaque GameBinaryCommand en une promesse de création de binaire de jeu
      const promises: Promise<GameBinary>[] = gameBinariesCommand.map(
        async (gameBinaryCommand: GameBinaryCommand): Promise<GameBinary> => {
          return await this.createGameBinary(gameBinaryCommand)
        },
      )

      // Exécute toutes les promesses en parallèle et attend qu'elles soient toutes résolues
      const gameBinaries: GameBinary[] = await Promise.all(promises)

      // Renvoie un tableau des IDs des binaires de jeu créés
      return gameBinaries.map((binary: GameBinary): number => binary.id)
    } catch (error: any) {
      logger.error('createGameBinaries error: ' + error.message)

      throw new InternalServerErrorException('Failed to create game binaries')
    }
  }

  /**
   * Fonction pour mettre à jour un binaire de jeu
   * @param {number} binaryId - L'ID du binaire de jeu à mettre à jour
   * @param {GameBinaryCommand} bucketCommand - La commande contenant les nouvelles informations du binaire de jeu
   * @returns {Promise<GameBinary>} - Le binaire de jeu mis à jour
   */
  public static async updateGameBinary(binaryId: number, bucketCommand: GameBinaryCommand): Promise<GameBinary> {
    try {
      // Récupérer le binaire de jeu par son ID
      const gameBinary: GameBinary = await GameBinary.findOrFail(binaryId)

      // Créer un objet BucketFileCommand pour le fichier binaire du jeu et mettre à jour l'entrée en base de données
      const bucketFileCommand: BucketFileCommand = {
        pathFilename: bucketCommand.pathfilename,
        bucketName: bucketCommand.bucketName,
      }
      await CloudStorageS3Service.updateFileInDB(bucketFileCommand, gameBinary.filesId)

      // Mettre à jour le binaire de jeu avec l'ID de la plateforme et l'ID du fichier
      return await gameBinary
        .merge({
          gamePlatformsId: bucketCommand.platformId,
          filesId: gameBinary.filesId,
        })
        .save()
    } catch (error: any) {
      logger.error('updateGameBinary error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Game binary not found with ID: ${binaryId}`)
      }

      throw new InternalServerErrorException('Failed to update game binary')
    }
  }

  /**
   * Méthode pour récupérer un binaire de jeu par son ID
   * @param {number} binaryId - L'ID du binaire de jeu à récupérer
   * @returns {Promise<GameBinary>} - Le binaire de jeu trouvé
   */
  public static async getGameBinaryById(binaryId: number): Promise<GameBinary> {
    try {
      // Récupérer le binaire de jeu par son ID avec les relations nécessaires
      return await GameBinary.query()
        .preload('gamePlatform')
        .preload('file', (fileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
          fileQuery.preload('bucket')
        })
        .where('id', binaryId)
        .firstOrFail()
    } catch (error: any) {
      logger.error('getGameBinaryById error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Game binary not found with ID: ${binaryId}`)
      }

      throw new InternalServerErrorException('Failed to get game binary by ID')
    }
  }

  /**
   * Méthode pour supprimer un binaire de jeu par son ID
   * @param {number} binaryId - L'ID du binaire de jeu à supprimer
   * @returns {Promise<void>} - Une promesse qui se résout lorsque le binaire de jeu est supprimé
   */
  public static async deleteGameBinary(binaryId: number): Promise<void> {
    try {
      // Récupérer le binaire de jeu par son ID
      const gameBinary: GameBinary = await GameBinary.findOrFail(binaryId)

      // Supprimer le game binary de la base de données
      await gameBinary.delete()
    } catch (error: any) {
      logger.error('deleteGameBinary error: ' + error.message)

      // Si le binaire de jeu n'est pas trouvé, lancer une exception NotFoundException
      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Game binary not found with ID: ${binaryId}`)
      }

      // Lancer une exception InternalServerErrorException pour les autres erreurs
      throw new InternalServerErrorException('Failed to delete game binary')
    }
  }
}
