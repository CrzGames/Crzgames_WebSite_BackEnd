import GameVersion from 'App/Models/GameVersion'
import Game from 'App/Models/Game'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'

export default class GameVersionsService {
  private static compareVersions(a: string, b: string): number {
    const aParts: number[] = a.replace(/^v/, '').split('.').map(Number)
    const bParts: number[] = b.replace(/^v/, '').split('.').map(Number)

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aVal: number = aParts[i] || 0
      const bVal: number = bParts[i] || 0

      if (aVal > bVal) return 1
      if (aVal < bVal) return -1
    }

    return 0
  }

  public static async getLatestAvailableVersion(gameId: number): Promise<GameVersion> {
    try {
      // Récupérer toutes les versions disponibles
      const gameVersions: GameVersion[] = await GameVersion.query()
        .where('games_id', gameId)
        .andWhere('is_available', true)
        .preload('game')

      // Si aucune version n'est trouvée, lancer une exception
      if (gameVersions.length === 0) {
        throw new NotFoundException(`No available version found for game ID ${gameId}`)
      }

      // Trier les versions en utilisant la fonction de comparaison
      gameVersions.sort((a: GameVersion, b: GameVersion) => this.compareVersions(a.version, b.version))

      // Retourner la dernière version
      return gameVersions[gameVersions.length - 1]
    } catch (error) {
      throw new NotFoundException(`No available version found for game ID ${gameId}`)
    }
  }
  public static async createGameVersion(
    gameId: number,
    gameVersionData: { version: string; is_available: boolean },
  ): Promise<GameVersion> {
    const game: Game = await Game.findOrFail(gameId)

    try {
      return await game.related('gameVersions').create(gameVersionData)
    } catch (error) {
      throw new BadRequestException(`Failed to create game version: ${error.message}`)
    }
  }

  public static async getAllGameVersions(): Promise<GameVersion[]> {
    try {
      return await GameVersion.query().preload('game')
    } catch (error) {
      throw new NotFoundException(`Failed to find game or game versions: ${error.message}`)
    }
  }

  public static async getAllGameVersionsByGameId(gameId: number): Promise<GameVersion[]> {
    const game: Game = await Game.findOrFail(gameId)

    try {
      return game.related('gameVersions').query().preload('game')
    } catch (error) {
      throw new NotFoundException(`Failed to find game or game versions: ${error.message}`)
    }
  }

  public static async getGameVersion(gameId: number, gameVersionId: number): Promise<GameVersion> {
    try {
      return await GameVersion.query()
        .where('id', gameVersionId)
        .andWhere('games_id', gameId)
        .preload('game')
        .firstOrFail()
    } catch (error) {
      throw new NotFoundException(`Game version not found: ${error.message}`)
    }
  }

  public static async updateGameVersion(
    gameId: number,
    gameVersionId: number,
    updateDataForIsAvailable: boolean,
  ): Promise<GameVersion> {
    const gameVersion: GameVersion = await this.getGameVersion(gameId, gameVersionId)
    gameVersion.merge({
      isAvailable: updateDataForIsAvailable,
    })

    try {
      await gameVersion.save()
      return gameVersion
    } catch (error) {
      throw new BadRequestException(`Failed to update game version: ${error.message}`)
    }
  }

  public static async deleteGameVersion(gameId: number, gameVersionId: number): Promise<boolean> {
    const gameVersion: GameVersion = await this.getGameVersion(gameId, gameVersionId)

    try {
      await gameVersion.delete()
      return true
    } catch (error) {
      throw new BadRequestException(`Failed to delete game version: ${error.message}`)
    }
  }
}
