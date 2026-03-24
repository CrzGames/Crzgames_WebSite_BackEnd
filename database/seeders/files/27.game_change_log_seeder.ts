import GameChangeLog from '#models/game_change_log'
import Game from '#models/game'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run() {
    const games: Game[] = await Game.all()

    if (games.length === 0) {
      logger.warn('No games found in the database. Make sure to seed games first.')
      return
    }

    // Crée des change log pour chaque jeu
    for (const game of games) {
      await GameChangeLog.create({
        gamesId: game.id,
        version: 'v1.0.0',
        releaseDate: DateTime.now(),
        content: 'Initial game release.',
      })

      await GameChangeLog.create({
        gamesId: game.id,
        version: 'v1.0.1',
        releaseDate: DateTime.now().plus({ days: 7 }), // Simule une mise à jour une semaine plus tard
        content: 'Bug fixes and performance improvements.',
      })
    }
  }
}
