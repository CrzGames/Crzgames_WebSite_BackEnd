import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import GameCategoryAssignment from 'App/Models/GameCategoryAssignment'

export default class GameCategoryAssignmentsService {
  // Fonction pour créer un nouveau game
  public static async createGameCategoryAssignment(
    gameId: number,
    gameCategoryIds: number[],
  ): Promise<GameCategoryAssignment[]> {
    try {
      const gameCategoryAssignments: Promise<GameCategoryAssignment>[] = gameCategoryIds.map(
        async (gameCategoryId: number): Promise<GameCategoryAssignment> => {
          return await GameCategoryAssignment.create({
            games_id: gameId,
            game_categories_id: gameCategoryId,
          })
        },
      )

      return await Promise.all(gameCategoryAssignments)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Fonction pour récupérer toutes les categories d'un game
  public static async getAllGameCategoryAssignmentByGameId(
    gameId: number,
  ): Promise<GameCategoryAssignment[]> {
    try {
      const gameCategoryAssignments: GameCategoryAssignment[] = await GameCategoryAssignment.query()
        .preload('game')
        .preload('gameCategory')
        .where('games_id', gameId)

      if (!gameCategoryAssignments || gameCategoryAssignments.length === 0) {
        throw new NotFoundException('No Game Category Assignments found for given Game ID')
      }

      return gameCategoryAssignments
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  // Fonction pour supprimer toutes les categories d'un game
  public static async deleteAllGameCategoryAssignmentByGameId(gameId: number): Promise<void> {
    try {
      const gameCategoryAssignments: GameCategoryAssignment[] = await GameCategoryAssignment.query()
        .preload('game')
        .preload('gameCategory')
        .where('games_id', gameId)

      if (!gameCategoryAssignments || gameCategoryAssignments.length === 0) {
        throw new NotFoundException('No delete GameCategoryAssignments found for given Game ID')
      }

      await Promise.all(
        gameCategoryAssignments.map(
          async (gameCategoryAssignment: GameCategoryAssignment): Promise<void> => {
            await gameCategoryAssignment.delete()
          },
        ),
      )
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  // Fonction pour récupérer tous les games d'une catégorie
  public static async getAllGameCategoryAssignmentByCategoryId(
    categoryId: number,
  ): Promise<GameCategoryAssignment[]> {
    try {
      const gameCategoryAssignments: GameCategoryAssignment[] = await GameCategoryAssignment.query()
        .preload('game')
        .preload('gameCategory')
        .where('game_categories_id', categoryId)

      if (!gameCategoryAssignments || gameCategoryAssignments.length === 0) {
        throw new NotFoundException('No Game Category Assignments found for given Category ID')
      }

      return gameCategoryAssignments
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
