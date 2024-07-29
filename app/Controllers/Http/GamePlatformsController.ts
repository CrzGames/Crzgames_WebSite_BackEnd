import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GamePlatform from 'App/Models/GamePlatform'
import GamePlatformsService from 'App/Services/GamePlatformsService'

export default class GamePlatformsController {
  //function to get all user roles
  private async getAllGamePlatforms({ response }: HttpContextContract): Promise<void> {
    const gamePlatforms: GamePlatform[] = await GamePlatformsService.getAllGamePlatforms()
    response.status(200).json(gamePlatforms)
  }
}
