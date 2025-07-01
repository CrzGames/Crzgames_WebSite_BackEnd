import type { HttpContext } from '@adonisjs/core/http'
import type Game from '#models/game'
import UserGameLibrariesService from '#services/user_game_libraries_service'
import type UserGameLibrary from '#models/user_game_library'
import { getAllUsersGamesLibrariesByUserIdValidator } from '#validators/UserGameLibrary/GetAllUsersGamesLibrariesByUserIdValidator'
import { createUsersGamesLibrariesValidator } from '#validators/UserGameLibrary/CreateUsersGamesLibrariesValidator'

export default class UserGameLibrariesController {
  //function to get all games library by user id in table users_games_library
  public async getAllUsersGamesLibrariesByUserId({ request, response }: HttpContext): Promise<void> {
    const payload: { userId: number } = await request.validateUsing(getAllUsersGamesLibrariesByUserIdValidator)
    const title: string = request.input('title')
    const games: Game[] = await UserGameLibrariesService.getAllUsersGamesLibrariesByUserId(payload.userId, title)

    response.status(200).json(games)
  }

  //function to add game to a user library in table users_games_library
  public async addGameToUserGameLibraries({ request, response }: HttpContext): Promise<void> {
    const payload: { userId: number; gameId: number } = await request.validateUsing(createUsersGamesLibrariesValidator)
    const gameLibrary: UserGameLibrary = await UserGameLibrariesService.addGameToUserGameLibraries(
      payload.userId,
      payload.gameId,
    )
    response.status(200).json(gameLibrary)
  }
}
