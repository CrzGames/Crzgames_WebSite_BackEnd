import Factory from '@ioc:Adonis/Lucid/Factory'
import GameChangeLog from 'App/Models/GameChangeLog'
import Game from 'App/Models/Game'
import { DateTime } from 'luxon'
import Logger from '@ioc:Adonis/Core/Logger'

export const GameChangeLogFactory = Factory.define(GameChangeLog, async ({ faker }) => {
  const gameIds: number[] = (await Game.all()).map((game: Game): number => game.id)

  // Map pour stocker les versions utilisées pour chaque jeu
  const usedVersions: Map<number, Set<string>> = new Map<number, Set<string>>()
  let randomGameId: number
  let version: string

  // Fonction pour vérifier si la version a déjà été utilisée pour ce jeu
  const isVersionUsed = (gameId: number, version: string) => {
    const versionsForGame = usedVersions.get(gameId)
    return versionsForGame ? versionsForGame.has(version) : false
  }

  // Boucle de génération avec vérification en mémoire
  do {
    randomGameId = faker.helpers.arrayElement(gameIds)
    version = faker.system.semver()

    // Vérifier dans notre Map
    if (isVersionUsed(randomGameId, version)) {
      continue
    }

    // On peut aussi vérifier en DB si nécessaire (mais cela coûte des requêtes)
    const existingLog = await GameChangeLog.query()
      .where('games_id', randomGameId)
      .where('version', version)
      .first()

    if (existingLog) {
      continue
    }

    // Si la version est nouvelle, on l'ajoute dans la Map
    if (!usedVersions.has(randomGameId)) {
      usedVersions.set(randomGameId, new Set())
    }
    usedVersions.get(randomGameId)?.add(version)

    break // on a trouvé une version unique pour ce jeu
  } while (true)

  return {
    games_id: randomGameId,
    version: version,
    release_date: DateTime.now(),
    content: faker.lorem.paragraphs(3),
  }
}).build()
