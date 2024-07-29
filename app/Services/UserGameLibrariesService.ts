import UserGameLibrary from 'App/Models/UserGameLibrary'
import Game from 'App/Models/Game'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { ProductService } from 'App/Services/ProductService'
import Product from 'App/Models/Product'
import { OrderProductService } from 'App/Services/OrderProductService'
import OrderProduct from 'App/Models/OrderProduct'
import { OrderService } from 'App/Services/OrderService'
import Order from 'App/Models/Order'

export default class UserGameLibrariesService {
  // Fonction pour récupérer tous les games pour un userId
  public static async getAllUsersGamesLibrariesByUserId(
    userId: number,
    title?: string,
  ): Promise<Game[]> {
    try {
      const userGameLibraries: UserGameLibrary[] = await UserGameLibrary.query()
        .where('users_id', userId)
        .select('games_id')

      if (!userGameLibraries || userGameLibraries.length === 0) {
        throw new NotFoundException('No userGameLibraries found')
      }

      const gameIds: number[] = userGameLibraries.map((ugl) => ugl.games_id)

      const baseQuery = Game.query()
        .whereIn('id', gameIds)
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

      if (title) {
        baseQuery.whereRaw('LOWER(title) LIKE ?', [`%${title.toLowerCase()}%`])
      }

      const games: Game[] = await baseQuery

      return games
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  // Fonction pour ajouter un game à la table users_games_library
  public static async addGameToUserLibrary(
    userId: number,
    gameId: number,
  ): Promise<UserGameLibrary> {
    try {
      // Vérifie d'abord si l'utilisateur a payé pour le jeu
      const isOwnedAndPaid: boolean = await this.verifyOwnershipAndPaidStatus(userId, gameId);
      if (!isOwnedAndPaid) {
        throw new BadRequestException('The game is either not paid for or not owned by the user');
      }

      return await UserGameLibrary.create({
        users_id: userId,
        games_id: gameId,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  private static async verifyOwnershipAndPaidStatus(userId: number, gameId: number): Promise<boolean> {
    const product: Product | null = await ProductService.getProductByGameIdAndProductCategoryGame(gameId)

    // Si product est null, c'est que le jeu est gratuit puisque tous les jeux payants ont un produit
    if (!product) {
      return true
    }

    try {
      // Si le produit est trouvé c'est que le jeu est payant.
      // Récupérer les OrderProduct liés à ce produit
      const orderProducts: OrderProduct[] = await OrderProductService.getAllOrderProductsByProductId(product.id);
      let userPaidValid: boolean = false

      for (const orderProduct of orderProducts) {
        const order: Order | null = await OrderService.getOrderById(orderProduct.orders_id);

        // Vérifiez si l'order est payé et appartient à l'utilisateur
        if (order && order.status_order === 'Paid' && order.users_id === userId) {
          userPaidValid = true;
          break;
        }
      }

      // Si au moins une commande valide est trouvée, renvoyer vrai
      return userPaidValid;
    } catch (error) {
      throw new BadRequestException('User has not paid for the game')
    }
  }
}
