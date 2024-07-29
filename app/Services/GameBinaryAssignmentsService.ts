import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import GameBinaryAssignment from 'App/Models/GameBinaryAssignment'
import GamePlatformAssignment from 'App/Models/GamePlatformAssignment'

export default class GameBinaryAssignmentsService {
  // Fonction pour ajouter des binaires à un jeu
  public static async createGameBinaryAssignments(
    gameId: number,
    gameBinaryIds: number[],
  ): Promise<GameBinaryAssignment[]> {
    try {
      const binaries: Promise<GameBinaryAssignment>[] = gameBinaryIds.map(
        async (gameBinaryId: number): Promise<GameBinaryAssignment> => {
          return await GameBinaryAssignment.create({
            games_id: gameId,
            game_binaries_id: gameBinaryId,
          })
        },
      )

      return await Promise.all(binaries)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  public static async deleteAllGameBinaryAssignmentsByGameId(gameId: number): Promise<void> {
    try {
      const gameBinaryAssignments: GameBinaryAssignment[] =
        await GameBinaryAssignment.query().where('games_id', gameId)

      if (!gameBinaryAssignments || gameBinaryAssignments.length === 0) {
        throw new NotFoundException('No GameBinaryAssignment found for given Game ID')
      }

      await Promise.all(
        gameBinaryAssignments.map(
          async (gameBinaryAssignment: GameBinaryAssignment): Promise<void> => {
            await gameBinaryAssignment.delete()
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

  // Fonction pour ajouter un binaire à un jeu
  public static async createGameBinaryAssignment(
    gameId: number,
    gameBinaryId: number,
  ): Promise<GameBinaryAssignment> {
    try {
      return await GameBinaryAssignment.create({
        games_id: gameId,
        game_binaries_id: gameBinaryId,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Fonction pour récupérer tous les binaires d'un jeu
  public static async getAllGameBinaryAssignmentByGameId(
    gameId: number,
  ): Promise<GameBinaryAssignment[]> {
    try {
      const binaryAssignments: GameBinaryAssignment[] = await GameBinaryAssignment.query()
        .preload('gameBinary')
        .preload('game')
        .where('games_id', gameId)

      if (!binaryAssignments || binaryAssignments.length === 0) {
        throw new NotFoundException('No Game Binary Assignments found for given Game ID')
      }

      return binaryAssignments
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
