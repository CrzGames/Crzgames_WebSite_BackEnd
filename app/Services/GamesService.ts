import Game from 'App/Models/Game'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import type { BucketFileCommand } from 'App/Services/CloudStorageS3Service'
import CloudStorageS3Service from 'App/Services/CloudStorageS3Service'
import File from 'App/Models/File'

export default class GamesService {
  // Fonction pour créer un nouveau game
  public static async createGames(
    title: string,
    upcomingGame: boolean,
    newGame: boolean,
    trailerPathFilename: string,
    trailerBucketName: string,
    picturePathFilename: string,
    pictureBucketName: string,
    logoPathFilename: string,
    logoBucketName: string,
    description: string,
  ): Promise<Game> {
    try {
      const bucketFileTrailerCommand: BucketFileCommand = {
        pathFilename: trailerPathFilename,
        bucketName: trailerBucketName,
      }
      const bucketFilePictureCommand: BucketFileCommand = {
        pathFilename: picturePathFilename,
        bucketName: pictureBucketName,
      }
      const bucketFileLogoCommand: BucketFileCommand = {
        pathFilename: logoPathFilename,
        bucketName: logoBucketName,
      }

      const trailerFileInstance: File =
        await CloudStorageS3Service.createFileInDB(bucketFileTrailerCommand)
      const pictureFileInstance: File =
        await CloudStorageS3Service.createFileInDB(bucketFilePictureCommand)
      const logoFileInstance: File =
        await CloudStorageS3Service.createFileInDB(bucketFileLogoCommand)

      return await Game.create({
        title,
        description,
        upcoming_game: upcomingGame,
        new_game: newGame,
        trailer_files_id: trailerFileInstance.id,
        picture_files_id: pictureFileInstance.id,
        logo_files_id: logoFileInstance.id,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Fonction pour mettre à jour un game
  public static async updateGames(
    id: number,
    title: string,
    upcomingGame: boolean,
    newGame: boolean,
    trailerPathFilename: string,
    trailerBucketName: string,
    picturePathFilename: string,
    pictureBucketName: string,
    logoPathFilename: string,
    logoBucketName: string,
    trailer_files_id: number,
    logo_files_id: number,
    picture_files_id: number,
    description: string,
  ): Promise<Game> {
    try {
      const bucketFileTrailerCommand: BucketFileCommand = {
        pathFilename: trailerPathFilename,
        bucketName: trailerBucketName,
      }
      const bucketFilePictureCommand: BucketFileCommand = {
        pathFilename: picturePathFilename,
        bucketName: pictureBucketName,
      }
      const bucketFileLogoCommand: BucketFileCommand = {
        pathFilename: logoPathFilename,
        bucketName: logoBucketName,
      }

      await CloudStorageS3Service.updateFileInDB(bucketFileTrailerCommand, trailer_files_id)
      await CloudStorageS3Service.updateFileInDB(bucketFilePictureCommand, picture_files_id)
      await CloudStorageS3Service.updateFileInDB(bucketFileLogoCommand, logo_files_id)

      // Updating in database
      const game: Game = await Game.findOrFail(id)
      return await game
        .merge({
          title,
          description,
          upcoming_game: upcomingGame,
          new_game: newGame,
        })
        .save()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Fonction pour supprimer un game
  public static async deleteGames(id: number): Promise<void> {
    const game: Game = await Game.findOrFail(id)

    try {
      await game.delete()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // Fonction pour récupérer un game par son id
  public static async getGamesById(id: number): Promise<Game> {
    try {
      return await Game.query()
        .preload('pictureFile', (pictureFileQuery): void => {
          pictureFileQuery.preload('bucket')
        })
        .preload('logoFile', (logoFileQuery): void => {
          logoFileQuery.preload('bucket')
        })
        .preload('trailerFile', (trailerFile): void => {
          trailerFile.preload('bucket')
        })
        .preload('gamePlatform')
        .preload('gameBinary', (gameBinaryQuery): void => {
          gameBinaryQuery.preload('gamePlatform')
          gameBinaryQuery.preload('file', (fileQuery): void => {
            fileQuery.preload('bucket')
          })
        })
        .preload('gameCategory')
        .preload('gameConfigurationMinimal')
        .preload('gameConfigurationRecommended')
        .preload('languages')
        .preload('gameVersions')
        .preload('gameMedias')
        .where('id', id)
        .firstOrFail()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // Fonction pour récupérer tous les games
  public static async getAllGames(title?: string): Promise<Game[]> {
    try {
      let games: Game[] | undefined

      if (title) {
        games = await Game.query()
          .preload('pictureFile', (pictureFileQuery): void => {
            pictureFileQuery.preload('bucket')
          })
          .preload('logoFile', (logoFileQuery): void => {
            logoFileQuery.preload('bucket')
          })
          .preload('trailerFile', (trailerFile): void => {
            trailerFile.preload('bucket')
          })
          .preload('gamePlatform')
          .preload('gameBinary', (gameBinaryQuery): void => {
            gameBinaryQuery.preload('gamePlatform')
            gameBinaryQuery.preload('file', (fileQuery): void => {
              fileQuery.preload('bucket')
            })
          })
          .preload('gameCategory')
          .preload('gameConfigurationMinimal')
          .preload('gameConfigurationRecommended')
          .preload('languages')
          .preload('gameVersions')
          .preload('gameMedias')
          .whereRaw('LOWER(title) LIKE ?', [`%${title.toLowerCase()}%`])
      } else {
        games = await Game.query()
          .preload('pictureFile', (pictureFileQuery): void => {
            pictureFileQuery.preload('bucket')
          })
          .preload('logoFile', (logoFileQuery): void => {
            logoFileQuery.preload('bucket')
          })
          .preload('trailerFile', (trailerFile): void => {
            trailerFile.preload('bucket')
          })
          .preload('gamePlatform')
          .preload('gameBinary', (gameBinaryQuery): void => {
            gameBinaryQuery.preload('gamePlatform')
            gameBinaryQuery.preload('file', (fileQuery): void => {
              fileQuery.preload('bucket')
            })
          })
          .preload('gameCategory')
          .preload('gameConfigurationMinimal')
          .preload('gameConfigurationRecommended')
          .preload('languages')
          .preload('gameVersions')
          .preload('gameMedias')
      }

      return games
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  //fonction filtre games par title sans sensitive case
  public static async getAllGamesByTitle(title: string): Promise<Game[]> {
    try {
      const games: Game[] = await Game.query().whereRaw('LOWER(title) LIKE ?', [
        `%${title.toLowerCase()}%`,
      ])

      if (!games || games.length === 0) {
        throw new NotFoundException('No games found')
      }

      return games
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  public static async getGameByTitle(title: string): Promise<Game> {
    try {
      return await Game.query()
        .where('title', title)
        .preload('pictureFile', (pictureFileQuery): void => {
          pictureFileQuery.preload('bucket')
        })
        .preload('logoFile', (logoFileQuery): void => {
          logoFileQuery.preload('bucket')
        })
        .preload('trailerFile', (trailerFile): void => {
          trailerFile.preload('bucket')
        })
        .preload('gamePlatform')
        .preload('gameBinary', (gameBinaryQuery): void => {
          gameBinaryQuery.preload('gamePlatform')
          gameBinaryQuery.preload('file', (fileQuery): void => {
            fileQuery.preload('bucket')
          })
        })
        .preload('gameCategory')
        .preload('gameConfigurationMinimal')
        .preload('gameConfigurationRecommended')
        .preload('languages')
        .preload('gameVersions')
        .preload('gameMedias')
        .firstOrFail()
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
