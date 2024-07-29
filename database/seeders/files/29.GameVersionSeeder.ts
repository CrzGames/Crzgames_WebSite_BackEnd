import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Game from 'App/Models/Game'
import GameVersion from 'App/Models/GameVersion'

export default class GameVersionSeeder extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    // Récupère tous les jeux présents dans la base de données
    const games: Game[] = await Game.all()

    for (const game of games) {
      // Crée les versions pour chaque jeu
      await GameVersion.create({
        games_id: game.id,
        version: 'v1.0.0',
        isAvailable: true,
      })

      await GameVersion.create({
        games_id: game.id,
        version: 'v1.0.1',
        isAvailable: false,
      })
    }
  }
}
