import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import Language from '#models/language'

export default class LanguagesService {
  public static async getAllLanguages(): Promise<Language[]> {
    try {
      const languages: Language[] = await Language.all()

      if (!languages || languages.length === 0) {
        throw new NotFoundException('No Languages found')
      }

      return languages
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
