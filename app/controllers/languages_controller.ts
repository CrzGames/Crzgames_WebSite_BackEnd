import type { HttpContext } from '@adonisjs/core/http'
import LanguagesService from '#services/languages_service'
import type Language from '#models/language'

/**
 *
 */
export default class LanguagesController {
  /**
   * Récupère tous les langages
   * @param {HttpContext} { response }
   * @return {*}  {Promise<void>}
   */
  public async getAllLanguages({ response }: HttpContext): Promise<void> {
    const languages: Language[] = await LanguagesService.getAllLanguages()
    response.status(200).json(languages)
  }
}
