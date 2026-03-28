import GameVersion from '#models/game_version'
import Game from '#models/game'
import BadRequestException from '#exceptions/bad_request_exception'
import NotFoundException from '#exceptions/not_found_exception'
import logger from '@adonisjs/core/services/logger'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import { errors as lucidErrors } from '@adonisjs/lucid'
import GameVersionsRealtimeService from '#services/game_versions_realtime_service'

/**
 * Un service pour gérer les versions de jeux.
 * Ce service fournit des méthodes pour récupérer la dernière version disponible d'un jeu,
 * créer une nouvelle version de jeu, récupérer toutes les versions de jeu, et gérer les
 * versions de jeu par ID.
 * @class GameVersionsService
 */
export default class GameVersionsService {
  /**
   * Compare deux versions de jeu sous forme de chaînes de caractères.
   * @param {string} a - La première version à comparer.
   * @param {string} b - La deuxième version à comparer.
   * @returns {number} - Retourne 1 si a > b, -1 si a < b, et 0 si elles sont égales.
   */
  private static compareVersions(a: string, b: string): number {
    // Supprimer le préfixe 'v' si présent et diviser les versions en parties numériques
    // Exemple: 'v1.2.3' devient [1, 2, 3] et 'v1.2.4' devient [1, 2, 4]
    // On utilise map(Number) pour convertir les parties en nombres
    // et on gère les cas où une version peut avoir moins de parties en ajoutant
    // des zéros pour les parties manquantes.
    const aParts: number[] = a.replace(/^v/, '').split('.').map(Number)
    const bParts: number[] = b.replace(/^v/, '').split('.').map(Number)

    // Comparer les parties des versions
    // On parcourt les parties des deux versions et on compare les valeurs
    // Si une version a plus de parties, on considère qu'elle est plus récente.
    // Si les parties sont égales, on continue à comparer les parties suivantes.
    // Si une partie de a est supérieure à la partie correspondante de b, on retourne 1.
    // Si une partie de a est inférieure à la partie correspondante de b, on retourne -1.
    // Si toutes les parties sont égales, on retourne 0.
    for (let i: number = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aVal: number = aParts[i] || 0
      const bVal: number = bParts[i] || 0

      if (aVal > bVal) return 1
      if (aVal < bVal) return -1
    }

    return 0
  }

  /**
   * Récupère la dernière version disponible d'un jeu.
   * @param {number} gameId - L'ID du jeu pour lequel on veut récupérer la dernière version.
   * @returns {Promise<GameVersion>} - La dernière version disponible du jeu.
   * @throws {NotFoundException} Si aucune version disponible n'est trouvée pour le jeu.
   */
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
    } catch (error: any) {
      logger.error('getLatestAvailableVersion error:' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch latest available version for game')
    }
  }

  /**
   * Crée une nouvelle version de jeu.
   * @param {number} gameId - L'ID du jeu pour lequel on veut créer une nouvelle version.
   * @param {object} gameVersionData - Les données de la nouvelle version de jeu.
   * @param {string} gameVersionData.version - La version du jeu.
   * @param {boolean} gameVersionData.is_available - Indique si la version est disponible.
   * @returns {Promise<GameVersion>} - La nouvelle version de jeu créée.
   * @throws {BadRequestException} Si la création de la version échoue.
   */
  public static async createGameVersion(
    gameId: number,
    gameVersionData: { version: string; is_available: boolean },
  ): Promise<GameVersion> {
    try {
      const game: Game = await Game.findOrFail(gameId)
      const createdGameVersion: GameVersion = await game.related('gameVersions').create(gameVersionData)
      await GameVersionsRealtimeService.broadcastLatestAvailableForGame(gameId)
      return createdGameVersion
    } catch (error: any) {
      logger.error('createGameVersion error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Game with ID ${gameId} not found`)
      }

      throw new BadRequestException('Failed to create game version')
    }
  }

  /**
   * Récupère toutes les versions de jeu.
   * @returns {Promise<GameVersion[]>} - Un tableau de toutes les versions de jeu.
   * @throws {NotFoundException} Si aucune version de jeu n'est trouvée.
   */
  public static async getAllGameVersions(): Promise<GameVersion[]> {
    try {
      // Récupérer toutes les versions de jeu avec leurs jeux associés
      const gameVersions: GameVersion[] = await GameVersion.query().preload('game')

      // Vérifier si des versions de jeu ont été trouvées
      if (gameVersions.length === 0) {
        throw new NotFoundException('No game versions found')
      }

      return gameVersions
    } catch (error: any) {
      logger.error('getAllGameVersions error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch all game versions')
    }
  }

  /**
   * Récupère toutes les versions de jeu pour un jeu spécifique par son ID.
   * @param {number} gameId - L'ID du jeu pour lequel on veut récupérer les versions.
   * @returns {Promise<GameVersion[]>} - Un tableau de toutes les versions de jeu pour le jeu spécifié.
   * @throws {NotFoundException} Si le jeu ou ses versions ne sont pas trouvés.
   */
  public static async getAllGameVersionsByGameId(gameId: number): Promise<GameVersion[]> {
    try {
      const game: Game = await Game.findOrFail(gameId)
      return game.related('gameVersions').query().preload('game')
    } catch (error: any) {
      logger.error('getAllGameVersionsByGameId error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Game with ID ${gameId} not found`)
      }

      throw new InternalServerErrorException('Failed to fetch game versions by game ID')
    }
  }

  /**
   * Récupère une version de jeu par son ID et l'ID du jeu.
   * @param {number} gameId - L'ID du jeu auquel la version appartient.
   * @param {number} gameVersionId - L'ID de la version de jeu à récupérer.
   * @returns {Promise<GameVersion>} - La version de jeu correspondante.
   * @throws {NotFoundException} Si la version de jeu n'est pas trouvée.
   */
  public static async getGameVersion(gameId: number, gameVersionId: number): Promise<GameVersion> {
    try {
      return await GameVersion.query()
        .where('id', gameVersionId)
        .andWhere('games_id', gameId)
        .preload('game')
        .firstOrFail()
    } catch (error: any) {
      logger.error('getGameVersion error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException(`Game version with ID ${gameVersionId} for game ID ${gameId} not found`)
      }

      throw new InternalServerErrorException('Failed to fetch game version by ID')
    }
  }

  /**
   * Met à jour une version de jeu en fonction de son ID et de l'ID du jeu.
   * @param {number} gameId - L'ID du jeu auquel la version appartient.
   * @param {number} gameVersionId - L'ID de la version de jeu à mettre à jour.
   * @param {boolean} updateDataForIsAvailable - Indique si la version est disponible ou non.
   * @returns {Promise<GameVersion>} - La version de jeu mise à jour.
   * @throws {BadRequestException} Si la mise à jour échoue.
   */
  public static async updateGameVersion(
    gameId: number,
    gameVersionId: number,
    updateDataForIsAvailable: boolean,
  ): Promise<GameVersion> {
    try {
      const gameVersion: GameVersion = await this.getGameVersion(gameId, gameVersionId)
      const updatedGameVersion: GameVersion = await gameVersion
        .merge({
          isAvailable: updateDataForIsAvailable,
        })
        .save()
      await GameVersionsRealtimeService.broadcastLatestAvailableForGame(gameId)
      return updatedGameVersion
    } catch (error: any) {
      logger.error('updateGameVersion error: ' + error.message)

      throw new InternalServerErrorException('Failed to update game version')
    }
  }

  /**
   * Supprime une version de jeu en fonction de son ID et de l'ID du jeu.
   * @param {number} gameId - L'ID du jeu auquel la version appartient.
   * @param {number} gameVersionId - L'ID de la version de jeu à supprimer.
   * @returns {Promise<boolean>} - Retourne true si la suppression a réussi, sinon false.
   * @throws {BadRequestException} Si la suppression échoue.
   */
  public static async deleteGameVersion(gameId: number, gameVersionId: number): Promise<boolean> {
    try {
      const gameVersion: GameVersion = await this.getGameVersion(gameId, gameVersionId)
      await gameVersion.delete()
      return true
    } catch (error: any) {
      logger.error('deleteGameVersion error: ' + error.message)

      throw new InternalServerErrorException('Failed to delete game version')
    }
  }
}
