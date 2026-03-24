import User from '#models/user'
import { UserRoles } from '#enums/user_roles'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import BadRequestException from '#exceptions/bad_request_exception'
import type { Authenticator } from '@adonisjs/auth'
import type { Authenticators } from '@adonisjs/auth/types'
import logger from '@adonisjs/core/services/logger'
import { errors as lucidErrors } from '@adonisjs/lucid'

/**
 * Type pour représenter un utilisateur avec son ID et son rôle.
 * @typedef {object} UserIdAndRole
 * @property {number} id - L'ID de l'utilisateur.
 * @property {string} role - Le rôle de l'utilisateur.
 */
export type UserIdAndRole = {
  id: number
  role: string
}

/**
 * Un service pour gérer les utilisateurs.
 * Ce service fournit des méthodes pour récupérer, mettre à jour et supprimer des utilisateurs,
 * ainsi que pour vérifier les rôles des utilisateurs.
 * @class UsersService
 */
export default class UsersService {
  /**
   * Fonction pour décoder le token et retourner l'utilisateur.
   * @param {Authenticator<Authenticators>} auth - L'authentificateur AdonisJS.
   * @returns {Promise<User>} - L'utilisateur correspondant au token.
   */
  public static async decodeTokenReturnUser(auth: Authenticator<Authenticators>): Promise<User> {
    try {
      // Récupérer l'utilisateur à partir de l'authentificateur
      const user: User = await User.findOrFail(auth.user?.id)

      // Charger le rôle de l'utilisateur
      await user.load('userRole')

      // Retourne l'utilisateur avec son rôle
      return user
    } catch (error: any) {
      logger.error('decodeTokenReturnUser error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`User with ID ${auth.user?.id} not found`)
      }

      throw new InternalServerErrorException('Failed to decode token and return user')
    }
  }

  /**
   * Fonction pour récupérer un utilisateur par son ID.
   * @param {number} userId - L'ID de l'utilisateur à récupérer.
   * @returns {Promise<User>} - L'utilisateur correspondant à l'ID.
   */
  public static async getUsersById(userId: number): Promise<User> {
    try {
      // Récupérer l'utilisateur par son ID
      return await User.findOrFail(userId)
    } catch (error: any) {
      logger.error('getUsersById error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`User with ID ${userId} not found`)
      }

      throw new InternalServerErrorException(`Failed to fetch user with ID ${userId}`)
    }
  }

  /**
   * Fonction pour récupérer le rôle d'un utilisateur par son ID.
   * @param {number} userId - L'ID de l'utilisateur dont on veut récupérer le rôle.
   * @returns {Promise<string>} - Le nom du rôle de l'utilisateur.
   */
  public static async getUserRoleByUserId(userId: number): Promise<string> {
    try {
      // Récupérer l'utilisateur par son ID et précharger son rôle
      const user: User = await User.query().where('id', userId).preload('userRole').firstOrFail()

      // Renvoyer le nom du rôle de l'utilisateur
      return user.userRole.name
    } catch (error: any) {
      logger.error('getUserRoleById error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`User with ID ${userId} not found`)
      }

      throw new InternalServerErrorException(`Failed to fetch user role for user with ID ${userId}`)
    }
  }

  /**
   * Fonction pour vérifier si un utilisateur est un support (admin, modérateur ou staff).
   * @param {number} userId - L'ID de l'utilisateur à vérifier.
   * @returns {Promise<boolean>} - True si l'utilisateur est un support, sinon false.
   */
  public static async isSupport(userId: number): Promise<boolean> {
    try {
      // Récupérer le rôle de l'utilisateur par son ID
      const userRole: string = await this.getUserRoleByUserId(userId)

      // Vérifier si le rôle de l'utilisateur est admin, modérateur ou staff et renvoie le résultat
      return userRole === UserRoles.ADMIN || userRole === UserRoles.MODERATOR || userRole === UserRoles.STAFF
    } catch (error: any) {
      logger.error('isSupport error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException(`Failed to check if user with ID ${userId} is support`)
    }
  }

  /**
   * Fonction pour récupérer tous les emails des utilisateurs.
   * @returns {Promise<string[]>} - Un tableau contenant les emails de tous les utilisateurs.
   */
  public static async getAllUsersEmail(): Promise<string[]> {
    try {
      // Récupérer tous les utilisateurs
      const users: User[] = await User.all()

      // Vérifier si des utilisateurs ont été trouvés
      if (users.length === 0) {
        throw new NotFoundException('No users found')
      }

      // Retourner tous les emails des utilisateurs trouvés
      return users.map((user: User): string => user.email)
    } catch (error) {
      logger.error('getAllUsersEmail error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch all user emails')
    }
  }

  /**
   * Fonction pour mettre à jour un utilisateur.
   * @param {Record<string, any>} payload - Les données de l'utilisateur à mettre à jour.
   * @returns {Promise<void>} - Une promesse qui se résout lorsque l'utilisateur est mis à jour.
   */
  public static async updateUsers(payload: Record<string, any>): Promise<void> {
    try {
      // Récupérer l'utilisateur par son ID
      const user: User = await User.findOrFail(payload.id)

      // Mettre à jour l'utilisateur avec les données du payload
      await user.merge(payload).save()
    } catch (error: any) {
      logger.error('updateUsers error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`User with ID ${payload.id} not found`)
      }

      throw new BadRequestException('Failed to update users')
    }
  }

  /**
   * Fonction pour mettre à jour le rôle d'un utilisateur.
   * @param {number} userId - L'ID de l'utilisateur dont on veut mettre à jour le rôle.
   * @param {number} roleId - L'ID du nouveau rôle à attribuer à l'utilisateur.
   * @returns {Promise<void>} - Une promesse qui se résout lorsque le rôle de l'utilisateur est mis à jour.
   */
  public static async updateUsersRole(userId: number, roleId: number): Promise<void> {
    try {
      // Récupérer l'utilisateur par son ID
      const user: User = await User.findOrFail(userId)

      // Mettre à jour le rôle de l'utilisateur avec l'ID du nouveau rôle
      await user.merge({ rolesId: roleId }).save()
    } catch (error: any) {
      logger.error('updateUsersRole error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`User with ID ${userId} not found`)
      }

      throw new BadRequestException('Failed to update user role')
    }
  }

  /**
   * Fonction pour supprimer un utilisateur.
   * @param {number} userId - L'ID de l'utilisateur à supprimer.
   * @returns {Promise<void>} - Une promesse qui se résout lorsque l'utilisateur est supprimé.
   */
  public static async deleteUsers(userId: number): Promise<void> {
    try {
      // Récupérer l'utilisateur par son ID
      const user: User = await User.findOrFail(userId)

      // Supprimer l'utilisateur
      await user.delete()
    } catch (error: any) {
      logger.error('deleteUsers error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`User with ID ${userId} not found`)
      }

      throw new InternalServerErrorException('Failed to delete user')
    }
  }

  /**
   * Fonction pour récupérer tous les utilisateurs.
   * @returns {Promise<User[]>} - Un tableau de tous les utilisateurs.
   */
  public static async getAllUsers(): Promise<User[]> {
    try {
      // Récupérer tous les utilisateurs et précharger leur rôle
      const users: User[] = await User.query().preload('userRole')

      if (users.length === 0) {
        throw new NotFoundException('No users found')
      }

      return users
    } catch (error: any) {
      logger.error('getAllUsers error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch all users')
    }
  }

  /**
   * Fonction pour récupérer tous les utilisateurs par leur nom d'utilisateur ou email.
   * @param {string} usernameOrEmail - Le nom d'utilisateur ou l'email à rechercher.
   * @returns {Promise<User[]>} - Un tableau de tous les utilisateurs correspondants.
   */
  public static async getAllUsersByUsernameOrEmail(usernameOrEmail: string): Promise<User[]> {
    try {
      // Vérifier si le paramètre est vide, dans ce cas, retourner tous les utilisateurs
      if (usernameOrEmail === '') {
        return this.getAllUsers()
      }

      // Sinon, rechercher les utilisateurs par nom d'utilisateur ou email
      return await User.query()
        .preload('userRole')
        .whereRaw('LOWER(username) LIKE ?', [`%${usernameOrEmail.toLowerCase()}%`])
        .orWhereRaw('LOWER(email) LIKE ?', [`%${usernameOrEmail.toLowerCase()}%`])
    } catch (error: any) {
      logger.error('getAllUsersByUsernameOrEmail error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch users by username or email')
    }
  }

  /**
   * Fonction pour récupérer l'ID et le rôle d'un utilisateur par son email.
   * @param {string} email - L'email de l'utilisateur à rechercher.
   * @returns {Promise<UserIdAndRole>} - Un objet contenant l'ID et le rôle de l'utilisateur.
   */
  public static async getUserRoleAndIdByEmail(email: string): Promise<UserIdAndRole> {
    try {
      // Récupérer l'utilisateur par son email et précharger son rôle
      const user: User = await User.query().where('email', email).preload('userRole').firstOrFail()

      // Renvoyer l'ID et le rôle de l'utilisateur
      return {
        id: user.id,
        role: user.userRole.name,
      } as UserIdAndRole
    } catch (error: any) {
      logger.error('getUserRoleAndIdByEmail error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`User with email ${email} not found`)
      }

      throw new InternalServerErrorException(`Failed to fetch user role and ID by email ${email}`)
    }
  }
}
