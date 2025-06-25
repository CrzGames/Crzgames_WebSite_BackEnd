import { NotFoundException } from '#exceptions/not_found_exception'
import GamePlatform from '#models/game_platform'
import { InternalServerErrorException } from '#exceptions/internal_server_error_exception'

export default class GamePlatformsService {
  // Fonction pour récupérer une plateforme de jeu par son ID
  public static async getGamePlatformsById(platformId: number): Promise<GamePlatform> {
    try {
      return await GamePlatform.findOrFail(platformId)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  public static async getAllGamePlatforms(): Promise<GamePlatform[]> {
    try {
      const gamePlatforms: GamePlatform[] | null = await GamePlatform.all()

      if (!gamePlatforms || gamePlatforms.length === 0) {
        throw new NotFoundException('Not found game platforms')
      }

      return gamePlatforms
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }
}
