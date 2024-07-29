import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import GamePlatformAssignment from 'App/Models/GamePlatformAssignment'

export default class GamePlatformAssignmentsService {
  // Fonction pour créer un nouveau game
  public static async createGamePlatformAssignment(
    gameId: number,
    gamePlatformIds: number[],
  ): Promise<GamePlatformAssignment[]> {
    try {
      const gamePlatformAssignments: Promise<GamePlatformAssignment>[] = gamePlatformIds.map(
        async (gamePlatformId: number): Promise<GamePlatformAssignment> => {
          return await GamePlatformAssignment.create({
            games_id: gameId,
            game_platforms_id: gamePlatformId,
          })
        },
      )

      return await Promise.all(gamePlatformAssignments)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  public static async deleteAllGamePlatformAssignmentByGameId(gameId: number): Promise<void> {
    try {
      const gamePlatformAssignments: GamePlatformAssignment[] = await GamePlatformAssignment.query()
        .preload('game')
        .preload('gamePlatform')
        .where('games_id', gameId)

      if (!gamePlatformAssignments || gamePlatformAssignments.length === 0) {
        throw new NotFoundException('No GamePlatformAssignment found for given Game ID')
      }

      await Promise.all(
        gamePlatformAssignments.map(
          async (gamePlatformAssignment: GamePlatformAssignment): Promise<void> => {
            await gamePlatformAssignment.delete()
          },
        ),
      )
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new BadRequestException(error.message)
      }
    }
  }

  //fonction pour recuperer tous les games d'une platform
  public static async getAllGamePlatformAssignmentByPlatformId(
    platformId: number,
  ): Promise<GamePlatformAssignment[]> {
    try {
      const gamePlatformAssignments: GamePlatformAssignment[] = await GamePlatformAssignment.query()
        .preload('game')
        .preload('gamePlatform')
        .where('game_platforms_id', platformId)

      if (!gamePlatformAssignments || gamePlatformAssignments.length === 0) {
        throw new NotFoundException('No Game Platform Assignments found for given Platform ID')
      }

      return gamePlatformAssignments
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  // Fonction pour récupérer toutes les platforms d'un game
  public static async getAllGamePlatformAssignmentByGameId(
    gameId: number,
  ): Promise<GamePlatformAssignment[]> {
    try {
      const gamePlatformAssignments: GamePlatformAssignment[] = await GamePlatformAssignment.query()
        .preload('game')
        .preload('gamePlatform')
        .where('games_id', gameId)

      if (!gamePlatformAssignments || gamePlatformAssignments.length === 0) {
        throw new NotFoundException('No Game Platform Assignments found for given Game ID')
      }

      return gamePlatformAssignments
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
