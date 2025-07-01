import UserRole from '#models/user_role'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import logger from '@adonisjs/core/services/logger'
import { errors as lucidErrors } from '@adonisjs/lucid'

/**
 * Un service pour gérer les rôles d'utilisateur.
 * Ce service fournit des méthodes pour récupérer tous les rôles d'utilisateur,
 * ainsi que pour récupérer un rôle d'utilisateur par son ID ou son nom.
 * @service UserRolesService
 */
export default class UserRolesService {
  /**
   * Récupère tous les rôles d'utilisateur.
   * @returns {Promise<UserRole[]>} Une promesse qui résout avec la liste de tous les rôles d'utilisateur.
   * @throws {NotFoundException} Si aucun rôle d'utilisateur n'est trouvé.
   * @throws {InternalServerErrorException} En cas d'erreur lors de la récupération des rôles.
   */
  public static async getAllUserRoles(): Promise<UserRole[]> {
    try {
      const userRoles: UserRole[] = await UserRole.all()

      if (userRoles.length === 0) {
        throw new NotFoundException('No UserRoles found')
      }

      return userRoles
    } catch (error: any) {
      logger.error('getAllUserRoles error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch getAllUserRoles')
    }
  }

  /**
   * Récupère un rôle d'utilisateur par son ID.
   * @param {number} id - L'ID du rôle d'utilisateur à récupérer.
   * @returns {Promise<UserRole>} Une promesse qui résout avec le rôle d'utilisateur correspondant.
   * @throws {NotFoundException} Si le rôle d'utilisateur n'est pas trouvé.
   * @throws {InternalServerErrorException} En cas d'erreur lors de la récupération du rôle.
   */
  public static async getUserRoleById(id: number): Promise<UserRole> {
    try {
      return await UserRole.findOrFail(id)
    } catch (error: any) {
      logger.error('getUserRoleById error: ' + error.message)

      // Rôle non trouvé dans la base de données
      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('getUserRoleById failed: User role not found')
      }

      // Erreur inattendue (base de données, etc.)
      throw new InternalServerErrorException('Failed to fetch user role by id')
    }
  }

  /**
   * Récupère un rôle d'utilisateur par son nom.
   * @param {string} name - Le nom du rôle d'utilisateur à récupérer.
   * @returns {Promise<UserRole>} Une promesse qui résout avec le rôle d'utilisateur correspondant.
   * @throws {NotFoundException} Si le rôle d'utilisateur n'est pas trouvé.
   * @throws {InternalServerErrorException} En cas d'erreur lors de la récupération du rôle.
   */
  public static async getUserRoleByName(name: string): Promise<UserRole> {
    try {
      return await UserRole.findByOrFail('name', name)
    } catch (error: any) {
      logger.error('getUserRoleByName error: ' + error.message)

      // Rôle non trouvé dans la base de données
      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('getUserRoleByName failed: User role not found')
      }

      // Erreur inattendue (base de données, etc.)
      throw new InternalServerErrorException('Failed to fetch user role by name')
    }
  }
}
