import GameChangeLog from 'App/Models/GameChangeLog'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import Game from 'App/Models/Game'

type GameChangeLogCommand = {
  id?: number
  games_id: number
  version: string
  content: string
}

export default class GameChangeLogService {
  // Function to create a game change log
  public static async createGameChangeLog(
    newGameChangeLog: GameChangeLogCommand,
  ): Promise<GameChangeLog> {
    try {
      return await GameChangeLog.create({
        games_id: newGameChangeLog.games_id,
        version: newGameChangeLog.version,
        content: newGameChangeLog.content,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Function to get all game change logs
  public static async getAllGameChangeLogs(): Promise<GameChangeLog[]> {
    try {
      const gameChangeLogs: GameChangeLog[] = await GameChangeLog.query()
        .orderBy('created_at', 'desc')
        .preload('game', (gameQuery): void => {
          gameQuery.preload('gamePlatform')
          gameQuery.preload('gameBinary')
          gameQuery.preload('gameCategory')
          gameQuery.preload('pictureFile', (pictureFileQuery): void => {
            pictureFileQuery.preload('bucket')
          })
          gameQuery.preload('logoFile', (logoFileQuery): void => {
            logoFileQuery.preload('bucket')
          })
          gameQuery.preload('trailerFile', (trailerFileQuery): void => {
            trailerFileQuery.preload('bucket')
          })
        })

      if (!gameChangeLogs || gameChangeLogs.length === 0) {
        throw new NotFoundException('getAllGameChangeLogs not found')
      }

      return gameChangeLogs
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  // Function to update a game change log
  public static async updateGameChangeLog(gameChangeLog: GameChangeLogCommand): Promise<void> {
    const gameChangeLogUpdated: GameChangeLog = await GameChangeLog.findOrFail(gameChangeLog.id)

    try {
      await gameChangeLogUpdated.merge(gameChangeLog).save()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Function to delete a game change log
  public static async deleteGameChangeLog(gameChangeLogId: number): Promise<void> {
    const gameChangeLogToDelete: GameChangeLog = await GameChangeLog.findOrFail(gameChangeLogId)

    try {
      await gameChangeLogToDelete.delete()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Function to get all game change log by game id
  public static async getAllGameChangeLogByGameId(gameId: number): Promise<GameChangeLog[]> {
    try {
      const gameChangeLogs: GameChangeLog[] = await GameChangeLog.query()
        .preload('game', (gameQuery): void => {
          gameQuery.preload('gamePlatform')
          gameQuery.preload('gameBinary')
          gameQuery.preload('gameCategory')
          gameQuery.preload('pictureFile', (pictureFileQuery): void => {
            pictureFileQuery.preload('bucket')
          })
          gameQuery.preload('logoFile', (logoFileQuery): void => {
            logoFileQuery.preload('bucket')
          })
          gameQuery.preload('trailerFile', (trailerFileQuery): void => {
            trailerFileQuery.preload('bucket')
          })
        })
        .where('games_id', gameId)
        .orderBy('version', 'desc')

      if (!gameChangeLogs || gameChangeLogs.length === 0) {
        throw new NotFoundException('No Game Change Logs found for given Game ID')
      }

      return gameChangeLogs
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  public static async getGameChangeLogById(id: number): Promise<GameChangeLog> {
    try {
      return await GameChangeLog.query()
        .preload('game', (gameQuery): void => {
          gameQuery.preload('gamePlatform')
          gameQuery.preload('gameBinary')
          gameQuery.preload('gameCategory')
          gameQuery.preload('pictureFile', (pictureFileQuery): void => {
            pictureFileQuery.preload('bucket')
          })
          gameQuery.preload('logoFile', (logoFileQuery): void => {
            logoFileQuery.preload('bucket')
          })
          gameQuery.preload('trailerFile', (trailerFileQuery): void => {
            trailerFileQuery.preload('bucket')
          })
        })
        .where('id', id)
        .orderBy('version', 'desc')
        .firstOrFail()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  public static async getAllGameChangeLogByGameTitle(title: string): Promise<GameChangeLog[]> {
    const game: Game = await Game.query().where('title', title).firstOrFail()
    return this.getAllGameChangeLogByGameId(game.id)
  }
}
