import { HttpContext } from '@adonisjs/core/http'
import Game from '#models/game'
import UserGameLibrariesService from '#services/user_game_libraries_service'
import GetAllUsersGamesLibrariesByUserIdValidator from '#validators/user_game_library/get_all_users_games_libraries_by_user_id_validator'
import CreateUsersGamesLibrariesValidator from '#validators/user_game_library/create_users_games_libraries_validator'
import UserGameLibrary from '#models/user_game_library'

export default class UserGameLibrariesController {
  //function to get all games library by user id in table users_games_library
  public async getAllUsersGamesLibrariesByUserId({ request, response }: HttpContext): Promise<void> {
    const payload: { userId: number } = await request.validate(GetAllUsersGamesLibrariesByUserIdValidator)
    const title: string = request.input('title')
    const games: Game[] = await UserGameLibrariesService.getAllUsersGamesLibrariesByUserId(payload.userId, title)

    response.status(200).json(games)
  }

  //function to add game to a user library in table users_games_library
  public async addGameToUserGameLibraries({ request, response }: HttpContext): Promise<void> {
    const payload: { userId: number; gameId: number } = await request.validate(CreateUsersGamesLibrariesValidator)
    const gameLibrary: UserGameLibrary = await UserGameLibrariesService.addGameToUserGameLibraries(
      payload.userId,
      payload.gameId,
    )
    response.status(200).json(gameLibrary)
  }
}
