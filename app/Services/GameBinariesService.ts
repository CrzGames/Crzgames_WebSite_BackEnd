import { BadRequestException } from 'App/Exceptions/BadRequestException'
import GameBinary from 'App/Models/GameBinary'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import CloudStorageS3Service from 'App/Services/CloudStorageS3Service'
import type { BucketFileCommand } from 'App/Services/CloudStorageS3Service'
import File from 'App/Models/File'

export type GameBinaryCommand = {
  pathfilename: string
  platformId: number
  bucketName: string
}

export default class GameBinariesService {
  // Fonction pour créer un nouveau binaire pour un jeu
  public static async createGameBinary(gameBinaryCommand: GameBinaryCommand): Promise<GameBinary> {
    try {
      const file: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: gameBinaryCommand.pathfilename,
        bucketName: gameBinaryCommand.bucketName,
      })

      return await GameBinary.create({
        game_platforms_id: gameBinaryCommand.platformId,
        files_id: file.id,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Fonction pour créer des nouveaux binaires pour un jeu
  public static async createGameBinaries(
    gameBinariesCommand: GameBinaryCommand[],
  ): Promise<number[]> {
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
      return gameBinaries.map((binary: GameBinary) => binary.id)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Fonction pour mettre à jour un binaire pour un jeu
  public static async updateGameBinary(
    binaryId: number,
    bucketCommand: GameBinaryCommand,
  ): Promise<GameBinary> {
    const gameBinary: GameBinary = await GameBinary.findOrFail(binaryId)

    try {
      const bucketFileCommand: BucketFileCommand = {
        pathFilename: bucketCommand.pathfilename,
        bucketName: bucketCommand.bucketName,
      }

      await CloudStorageS3Service.updateFileInDB(bucketFileCommand, gameBinary.files_id)

      return await gameBinary
        .merge({
          game_platforms_id: bucketCommand.platformId,
          files_id: gameBinary.files_id,
        })
        .save()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // function to get a binary by id
  public static async getGameBinaryById(binaryId: number): Promise<GameBinary> {
    try {
      return await GameBinary.query()
        .preload('gamePlatform')
        .preload('file', (fileQuery): void => {
          fileQuery.preload('bucket')
        })
        .where('id', binaryId)
        .firstOrFail()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // function to delete a binary by id
  public static async deleteGameBinary(binaryId: number): Promise<void> {
    const gameBinary: GameBinary = await GameBinary.findOrFail(binaryId)

    try {
      await gameBinary.delete()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
