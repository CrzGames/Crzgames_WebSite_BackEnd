import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import UserGameLibrariesService from 'App/Services/UserGameLibrariesService'
import GetAllUsersGamesLibrariesByUserIdValidator from 'App/Validators/UserGameLibrary/GetAllUsersGamesLibrariesByUserIdValidator'
import CreateUsersGamesLibrariesValidator from 'App/Validators/UserGameLibrary/CreateUsersGamesLibrariesValidator'
import UserGameLibrary from 'App/Models/UserGameLibrary'

export default class UserGameLibrariesController {
  //function to get all games library by user id in table users_games_library
  private async getAllUsersGamesLibrariesByUserId({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: { userId: number } = await request.validate(
      GetAllUsersGamesLibrariesByUserIdValidator,
    )
    const title: string = request.input('title')
    const games: Game[] = await UserGameLibrariesService.getAllUsersGamesLibrariesByUserId(
      payload.userId,
      title,
    )

    response.status(200).json(games)
  }

  //function to add game to a user library in table users_games_library
  private async addGameToUserLibrary({ request, response }: HttpContextContract): Promise<void> {
    const payload: { userId: number; gameId: number } = await request.validate(
      CreateUsersGamesLibrariesValidator,
    )
    const gameLibrary: UserGameLibrary = await UserGameLibrariesService.addGameToUserLibrary(
      payload.userId,
      payload.gameId,
    )
    response.status(200).json(gameLibrary)
  }
}
