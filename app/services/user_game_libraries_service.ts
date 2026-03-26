import UserGameLibrary from '#models/user_game_library'
import Game from '#models/game'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import BadRequestException from '#exceptions/bad_request_exception'
import { ProductService } from '#services/product_service'
import type Product from '#models/product'
import { OrderProductService } from '#services/order_product_service'
import type OrderProduct from '#models/order_product'
import { OrderService } from '#services/order_service'
import type Order from '#models/order'
import type File from '#models/file'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type { ManyToManyQueryBuilderContract, RelationQueryBuilderContract } from '@adonisjs/lucid/types/relations'
import type GameBinary from '#models/game_binary'
import logger from '@adonisjs/core/services/logger'

/**
 * Service pour gérer les bibliothèques de jeux des utilisateurs.
 * Fournit des méthodes pour récupérer tous les jeux d'un utilisateur et pour ajouter un
 * jeu à la bibliothèque d'un utilisateur.
 * @class UserGameLibrariesService
 */
export default class UserGameLibrariesService {
  /**
   * Fonction pour récupérer tous les jeux d'un utilisateur par son ID.
   * @param {number} userId - L'ID de l'utilisateur dont on veut récupérer les jeux.
   * @param {string} [title] - Un titre optionnel pour filtrer les jeux par titre.
   * @returns {Promise<Game[]>} - Un tableau de jeux appartenant à l'utilisateur.
   * @throws {NotFoundException} Si aucun jeu n'est trouvé pour l'utilisateur.
   * @throws {InternalServerErrorException} En cas d'erreur lors de la récupération des jeux.
   */
  public static async getAllUsersGamesLibrariesByUserId(userId: number, title?: string): Promise<Game[]> {
    try {
      // Récupérer les bibliothèques de jeux de l'utilisateur
      const userGameLibraries: UserGameLibrary[] = await UserGameLibrary.query()
        .where('users_id', userId)
        .select('games_id')

      // Vérifier si des bibliothèques de jeux ont été trouvées
      if (userGameLibraries.length === 0) {
        throw new NotFoundException('No userGameLibraries found')
      }

      // Extraire les IDs des jeux à partir des bibliothèques de jeux de l'utilisateur
      const gameIds: number[] = userGameLibraries
        .map((userGameLibrary: UserGameLibrary): number | null => userGameLibrary.gamesId)
        .filter((gameId: number | null): gameId is number => gameId !== null)

      // Préparer la requête de base pour récupérer les jeux
      const baseQuery: ModelQueryBuilderContract<typeof Game, Game> = Game.query()
        .whereIn('id', gameIds)
        .preload('pictureFile', (pictureFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
          pictureFileQuery.preload('bucket')
        })
        .preload('logoFile', (logoFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
          logoFileQuery.preload('bucket')
        })
        .preload('trailerFile', (trailerFile: RelationQueryBuilderContract<typeof File, any>): void => {
          trailerFile.preload('bucket')
        })
        .preload('gamePlatform')
        .preload('gameBinary', (gameBinaryQuery: ManyToManyQueryBuilderContract<typeof GameBinary, any>): void => {
          gameBinaryQuery.preload('gamePlatform')
          gameBinaryQuery.preload('file', (fileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
            fileQuery.preload('bucket')
          })
        })
        .preload('gameCategory')
        .preload('gameVersions')

      // Si un titre est fourni, filtrer les jeux par titre
      if (title) {
        baseQuery.whereRaw('LOWER(title) LIKE ?', [`%${title.toLowerCase()}%`])
      }

      // Exécuter la requête pour récupérer les jeux
      const games: Game[] = await baseQuery

      return games
    } catch (error) {
      logger.error('getAllUsersGamesLibrariesByUserId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch user games libraries by user ID')
    }
  }

  /**
   * Fonction pour ajouter un jeu à la bibliothèque d'un utilisateur.
   * Vérifie d'abord si l'utilisateur a payé pour le jeu avant de l'ajouter.
   * @param {number} userId - L'ID de l'utilisateur à qui le jeu sera ajouté.
   * @param {number} gameId - L'ID du jeu à ajouter à la bibliothèque de l'utilisateur.
   * @returns {Promise<UserGameLibrary>} - La bibliothèque de jeux de l'utilisateur mise à jour.
   * @throws {BadRequestException} Si le jeu n'est pas payé ou n'est pas possédé par l'utilisateur.
   */
  public static async addGameToUserGameLibraries(userId: number, gameId: number): Promise<UserGameLibrary> {
    try {
      // Vérifie d'abord si l'utilisateur a payé pour le jeu
      const isOwnedAndPaid: boolean = await this.verifyOwnershipAndPaidStatus(userId, gameId)
      if (!isOwnedAndPaid) {
        throw new BadRequestException('The game is either not paid for or not owned by the user')
      }

      // Si l'utilisateur possède le jeu et l'a payé, ajoute le jeu à la bibliothèque de l'utilisateur
      return await UserGameLibrary.create({
        usersId: userId,
        gamesId: gameId,
      })
    } catch (error: any) {
      logger.error('addGameToUserGameLibraries error: ' + error.message)

      if (error instanceof BadRequestException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to add game to user game libraries')
    }
  }

  /**
   * Fonction pour vérifier si l'utilisateur possède le jeu et a payé pour celui-ci.
   * @param {number} userId - L'ID de l'utilisateur à vérifier.
   * @param {number} gameId - L'ID du jeu à vérifier.
   * @returns {Promise<boolean>} - Vrai si l'utilisateur possède le jeu et a payé, sinon faux.
   * @throws {BadRequestException} Si l'utilisateur n'a pas payé pour le jeu.
   */
  private static async verifyOwnershipAndPaidStatus(userId: number, gameId: number): Promise<boolean> {
    // Récupérer le produit associé au jeu par son ID et la catégorie de produit 'Game'
    const product: Product | null = await ProductService.getProductByGameIdAndProductCategoryGame(gameId)

    // Si product est null, c'est que le jeu est gratuit puisque tous les jeux payants ont un produit
    if (!product) {
      return true
    }

    try {
      // Si le produit est trouvé c'est que le jeu est payant.
      // Récupérer les OrderProduct liés à ce produit
      const orderProducts: OrderProduct[] = await OrderProductService.getAllOrderProductsByProductId(product.id)
      let userPaidValid: boolean = false

      // Parcourir les OrderProduct pour vérifier si l'utilisateur a payé pour au moins une commande
      for (const orderProduct of orderProducts) {
        if (orderProduct.ordersId === null) {
          continue
        }
        const order: Order | null = await OrderService.getOrderById(orderProduct.ordersId)

        // Vérifiez si l'order est payé et appartient à l'utilisateur
        if (order?.statusOrder === 'Paid' && order.usersId === userId) {
          userPaidValid = true
          break
        }
      }

      // Si au moins une commande valide est trouvée, renvoyer vrai
      return userPaidValid
    } catch (error: any) {
      logger.error('verifyOwnershipAndPaidStatus error: ' + error.message)

      if (error instanceof BadRequestException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to verify ownership and paid status for user game libraries')
    }
  }
}
