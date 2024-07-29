import Factory from '@ioc:Adonis/Lucid/Factory'
import UserGameLibrary from 'App/Models/UserGameLibrary'
import User from 'App/Models/User'
import Game from 'App/Models/Game'

export const UserGameLibraryFactory = Factory.define(UserGameLibrary, async ({ faker }) => {
  const userIds: number[] = (await User.all()).map((user: User) => user.id)
  const randomUserId: number = faker.helpers.arrayElement(userIds)

  const gameIds: number[] = (await Game.all()).map((game: Game) => game.id)
  const randomGameId: number = faker.helpers.arrayElement(gameIds)

  return {
    users_id: randomUserId,
    games_id: randomGameId,
  }
}).build()
