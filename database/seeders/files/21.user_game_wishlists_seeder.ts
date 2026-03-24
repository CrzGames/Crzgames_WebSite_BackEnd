import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserGameWishlist from '#models/user_game_wishlist'
import User from '#models/user'
import Game from '#models/game'

export default class UserGameWishlistSeeder extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    // Récupérer tous les utilisateurs et jeux existants
    const users: User[] = await User.all()
    const games: Game[] = await Game.all()

    // Vérifier s'il y a des utilisateurs et des jeux
    if (users.length === 0 || games.length === 0) {
      console.warn('No users or games found. Please seed users and games first.')
      return
    }

    // Générer un nombre aléatoire d'entrées (par exemple, 20)
    const numberOfEntries: number = 20
    for (let i = 0; i < numberOfEntries; i++) {
      // Sélectionner un user_id et un game_id aléatoires
      const randomUser: User = users[Math.floor(Math.random() * users.length)]
      const randomGame: Game = games[Math.floor(Math.random() * games.length)]

      // Ajouter une entrée unique (éviter les doublons user_id + game_id)
      const existingEntry: UserGameWishlist | null = await UserGameWishlist.query()
        .where('users_id', randomUser.id)
        .andWhere('games_id', randomGame.id)
        .first()

      if (!existingEntry) {
        await UserGameWishlist.create({
          usersId: randomUser.id,
          gamesId: randomGame.id,
        })
      }
    }
  }
}
