import factory from '@adonisjs/lucid/factories'
import UserGameLibrary from '#models/user_game_library'
import User from '#models/user'
import Game from '#models/game'

export const UserGameLibraryFactory = factory
  .define(UserGameLibrary, async ({ faker }) => {
    const userIds: number[] = (await User.all()).map((user: User) => user.id)
    const randomUserId: number = faker.helpers.arrayElement(userIds)

    const gameIds: number[] = (await Game.all()).map((game: Game) => game.id)
    const randomGameId: number = faker.helpers.arrayElement(gameIds)

    return {
      usersId: randomUserId,
      gamesId: randomGameId,
    }
  })
  .build()
