import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Game from '#models/game'
import GameVersion from '#models/game_version'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    // Récupère tous les jeux présents dans la base de données
    const games: Game[] = await Game.all()

    for (const game of games) {
      // Crée les versions pour chaque jeu
      await GameVersion.create({
        games_id: game.id,
        version: 'v1.0.0',
        is_available: true,
      })

      await GameVersion.create({
        games_id: game.id,
        version: 'v1.0.1',
        is_available: false,
      })
    }
  }
}
