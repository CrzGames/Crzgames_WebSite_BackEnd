import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import Language from '#models/language'
import logger from '@adonisjs/core/services/logger'

/**
 * Un service pour gérer les langues.
 * Ce service fournit une méthode pour récupérer toutes les langues disponibles.
 * @class LanguagesService
 */
export default class LanguagesService {
  /**
   * Récupère toutes les langues disponibles.
   * @returns {Promise<Language[]>} - Une promesse qui résout avec un tableau de langues.
   * @throws {NotFoundException} Si aucune langue n'est trouvée.
   * @throws {InternalServerErrorException} En cas d'erreur interne du serveur.
   */
  public static async getAllLanguages(): Promise<Language[]> {
    try {
      // Récupérer toutes les langues disponibles
      const languages: Language[] = await Language.all()

      // Vérifier si des langues ont été trouvées
      if (languages.length === 0) {
        throw new NotFoundException('No Languages found')
      }

      return languages
    } catch (error: any) {
      logger.error('getAllLanguages error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch all languages')
    }
  }
}
