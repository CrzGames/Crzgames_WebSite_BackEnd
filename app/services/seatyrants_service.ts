import UsersService from '#services/users_service'
import type { UserIdAndRole } from '#services/users_service'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'

/**
 * Un service pour SeaTyrants.
 * Ce service fournit des méthodes pour interagir avec les utilisateurs de SeaTyrants.
 * @class SeaTyrantsService
 */
export default class SeaTyrantsService {
  /**
   * Récupère les informations de l'utilisateur par son email.
   * @param {string} email - L'email de l'utilisateur.
   * @returns {Promise<UserIdAndRole>} - Les informations de l'utilisateur, y compris son ID et son rôle.
   * @throws {InternalServerErrorException} En cas d'erreur lors de la récupération des informations de l'utilisateur.
   */
  public static async getInfoUser(email: string): Promise<UserIdAndRole> {
    try {
      return await UsersService.getUserRoleAndIdByEmail(email)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
