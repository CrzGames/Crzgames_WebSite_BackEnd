import type { UserRoles } from '#enums/user_roles'
import type User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

/**
 * Exemple d'utilisation :
 * router.get('/health', [HealthController, 'handle']).use(middleware.roleAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]))
 */

/**
 * Role authorization middleware
 * @class RoleAuth
 */
export default class RoleAuth {
  /**
   * Handle user authentication and role authorization
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {Function} next - The next middleware function
   * @param {UserRoles[]} allowedRoles - The roles allowed to access the resource
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async handle(
    { auth, response }: HttpContext,
    next: () => Promise<void>,
    allowedRoles: UserRoles[],
  ): Promise<any> {
    try {
      // Authentifier l'utilisateur
      await auth.authenticate()

      // Récupérer l'utilisateur authentifié
      const user: User = auth.user!

      // Charger la relation `userRole` pour vérifier le rôle de l'utilisateur
      await user.load('userRole')

      // Vérifier si l'utilisateur a un rôle autorisé
      if (!allowedRoles.includes(user.userRole.name as UserRoles)) {
        return response.forbidden({
          message: 'You do not have the necessary permissions to access this resource.',
        })
      }

      // Passer au middleware suivant ou au contrôleur
      await next()
    } catch (error: any) {
      logger.error(error)
      return response.unauthorized({ message: 'Authentication required.' })
    }
  }
}
