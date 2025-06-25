import { HttpContext } from '@adonisjs/core/http'
import GamePlatform from '#models/game_platform'
import GamePlatformsService from '#services/game_platforms_service'

export default class GamePlatformsController {
  //function to get all user roles
  public async getAllGamePlatforms({ response }: HttpContext): Promise<void> {
    const gamePlatforms: GamePlatform[] = await GamePlatformsService.getAllGamePlatforms()
    response.status(200).json(gamePlatforms)
  }
}
