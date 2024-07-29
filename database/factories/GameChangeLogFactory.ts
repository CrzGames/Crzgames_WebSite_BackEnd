import Factory from '@ioc:Adonis/Lucid/Factory'
import GameChangeLog from 'App/Models/GameChangeLog'
import Game from 'App/Models/Game'
import { DateTime } from 'luxon'

export const GameChangeLogFactory = Factory.define(GameChangeLog, async ({ faker }) => {
  const gameIds: number[] = (await Game.all()).map((game: Game) => game.id)
  let randomGameId: number
  let version: string
  let existingLog: GameChangeLog | null = null

  do {
    randomGameId = faker.helpers.arrayElement(gameIds)
    version = faker.system.semver()
    existingLog = await GameChangeLog.query()
      .where('games_id', randomGameId)
      .where('version', version)
      .first()
  } while (existingLog !== null)

  return {
    games_id: randomGameId,
    version: version,
    release_date: DateTime.now(),
    content: faker.lorem.paragraphs(3),
  }
}).build()
