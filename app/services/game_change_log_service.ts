import GameChangeLog from '#models/game_change_log'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import Game from '#models/game'
import type File from '#models/file'
import logger from '@adonisjs/core/services/logger'
import type { RelationQueryBuilderContract } from '@adonisjs/lucid/types/relations'
import { errors as lucidErrors } from '@adonisjs/lucid'

/**
 * Type qui représente une commande pour créer ou mettre à jour un journal de modifications de jeu
 * @property {number} [id] - L'ID du journal de modifications (optionnel, pour la mise à jour)
 * @property {number} games_id - L'ID du jeu auquel le journal de modifications est associé
 * @property {string} version - La version du jeu pour laquelle le journal de modifications est créé
 * @property {string} content - Le contenu du journal de modifications
 */
type GameChangeLogCommand = {
  id?: number
  games_id: number
  version: string
  content: string
}

/**
 * Service pour gérer les journaux de modifications de jeu
 * Fournit des méthodes pour créer, récupérer, mettre à jour et supprimer des journaux de modifications de jeu
 * @class GameChangeLogService
 */
export default class GameChangeLogService {
  /**
   * Fonction pour créer un nouveau journal de modifications de jeu
   * @param {GameChangeLogCommand} newGameChangeLog - La commande contenant les informations du nouveau journal de modifications
   * @returns {Promise<GameChangeLog>} - Le journal de modifications de jeu créé
   */
  public static async createGameChangeLog(newGameChangeLog: GameChangeLogCommand): Promise<GameChangeLog> {
    try {
      // Créer un nouveau journal de modifications de jeu dans la base de données
      return await GameChangeLog.create({
        gamesId: newGameChangeLog.games_id,
        version: newGameChangeLog.version,
        content: newGameChangeLog.content,
      })
    } catch (error: any) {
      logger.error('createGameChangeLog error: ' + error.message)

      throw new InternalServerErrorException('Failed to create game change log')
    }
  }

  /**
   * Fonction pour récupérer tous les journaux de modifications de jeu
   * @returns {Promise<GameChangeLog[]>} - Un tableau de tous les journaux
   */
  public static async getAllGameChangeLogs(): Promise<GameChangeLog[]> {
    try {
      // Récupérer tous les journaux de modifications de jeu, triés par date de création décroissante
      const gameChangeLogs: GameChangeLog[] = await GameChangeLog.query()
        .orderBy('created_at', 'desc')
        .preload('game', (gameQuery: RelationQueryBuilderContract<typeof Game, any>): void => {
          gameQuery.preload('gamePlatform')
          gameQuery.preload('gameBinary')
          gameQuery.preload('gameCategory')
          gameQuery.preload('pictureFile', (pictureFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
            pictureFileQuery.preload('bucket')
          })
          gameQuery.preload('logoFile', (logoFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
            logoFileQuery.preload('bucket')
          })
          gameQuery.preload('trailerFile', (trailerFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
            trailerFileQuery.preload('bucket')
          })
        })

      // Vérifier si des journaux de modifications de jeu ont été trouvés
      if (gameChangeLogs.length === 0) {
        throw new NotFoundException('No Game Change Logs found')
      }

      return gameChangeLogs
    } catch (error: any) {
      logger.error('getAllGameChangeLogs error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch all game change logs')
    }
  }

  /**
   * Fonction pour mettre à jour un journal de modifications de jeu
   * @param {GameChangeLogCommand} gameChangeLog - La commande contenant les informations du journal de modifications à mettre à jour
   * @returns {Promise<void>} - Aucune valeur de retour, la fonction met à jour le journal de modifications
   */
  public static async updateGameChangeLog(gameChangeLog: GameChangeLogCommand): Promise<void> {
    try {
      // Récupérer le journal de modifications de jeu par son ID
      const gameChangeLogUpdated: GameChangeLog = await GameChangeLog.findOrFail(gameChangeLog.id)

      // Mettre à jour le journal de modifications de jeu avec les nouvelles informations
      await gameChangeLogUpdated
        .merge({
          gamesId: gameChangeLog.games_id,
          version: gameChangeLog.version,
          content: gameChangeLog.content,
        })
        .save()
    } catch (error: any) {
      logger.error('updateGameChangeLog error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('Game Change Log not found')
      }

      throw new InternalServerErrorException('Failed to update game change log')
    }
  }

  /**
   * Fonction pour supprimer un journal de modifications de jeu par son ID
   * @param {number} gameChangeLogId - L'ID du journal de modifications de jeu à supprimer
   * @returns {Promise<void>} - Aucune valeur de retour, la fonction supprime le journal de modifications
   */
  public static async deleteGameChangeLog(gameChangeLogId: number): Promise<void> {
    try {
      // Récupérer le journal de modifications de jeu par son ID
      const gameChangeLogToDelete: GameChangeLog = await GameChangeLog.findOrFail(gameChangeLogId)

      // Supprimer le journal de modifications de jeu récupéré
      await gameChangeLogToDelete.delete()
    } catch (error: any) {
      logger.error('deleteGameChangeLog error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('Game Change Log not found')
      }

      throw new InternalServerErrorException('Failed to delete game change log')
    }
  }

  /**
   * Fonction pour récupérer tous les journaux de modifications de jeu par l'ID du jeu
   * @param {number} gameId - L'ID du jeu pour lequel récupérer les journaux de modifications
   * @returns {Promise<GameChangeLog[]>} - Un tableau de tous les journaux de modifications de jeu associés au jeu
   */
  public static async getAllGameChangeLogByGameId(gameId: number): Promise<GameChangeLog[]> {
    try {
      // Récupérer tous les journaux de modifications de jeu associés à l'ID du jeu donné
      const gameChangeLogs: GameChangeLog[] = await GameChangeLog.query()
        .preload('game', (gameQuery: RelationQueryBuilderContract<typeof Game, any>): void => {
          gameQuery.preload('gamePlatform')
          gameQuery.preload('gameBinary')
          gameQuery.preload('gameCategory')
          gameQuery.preload('pictureFile', (pictureFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
            pictureFileQuery.preload('bucket')
          })
          gameQuery.preload('logoFile', (logoFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
            logoFileQuery.preload('bucket')
          })
          gameQuery.preload('trailerFile', (trailerFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
            trailerFileQuery.preload('bucket')
          })
        })
        .where('gamesId', gameId)
        .orderBy('version', 'desc')

      // Vérifier si des journaux de modifications de jeu ont été trouvés pour l'ID du jeu donné
      if (gameChangeLogs.length === 0) {
        throw new NotFoundException('No Game Change Logs found for given Game ID')
      }

      return gameChangeLogs
    } catch (error) {
      logger.error('getAllGameChangeLogByGameId error: ' + error.message)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to fetch all game change logs by game ID')
    }
  }

  /**
   * Fonction pour récupérer un journal de modifications de jeu par son ID
   * @param {number} id - L'ID du journal de modifications de jeu à récupérer
   * @returns {Promise<GameChangeLog>} - Le journal de modifications de jeu correspondant à l'ID
   */
  public static async getGameChangeLogById(id: number): Promise<GameChangeLog> {
    try {
      // Récupérer le journal de modifications de jeu par son ID
      return await GameChangeLog.query()
        .preload('game', (gameQuery: RelationQueryBuilderContract<typeof Game, any>): void => {
          gameQuery.preload('gamePlatform')
          gameQuery.preload('gameBinary')
          gameQuery.preload('gameCategory')
          gameQuery.preload('pictureFile', (pictureFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
            pictureFileQuery.preload('bucket')
          })
          gameQuery.preload('logoFile', (logoFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
            logoFileQuery.preload('bucket')
          })
          gameQuery.preload('trailerFile', (trailerFileQuery: RelationQueryBuilderContract<typeof File, any>): void => {
            trailerFileQuery.preload('bucket')
          })
        })
        .where('id', id)
        .orderBy('version', 'desc')
        .firstOrFail()
    } catch (error: any) {
      logger.error('getGameChangeLogById error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('Game Change Log not found')
      }

      throw new InternalServerErrorException('Failed to fetch game change log by ID')
    }
  }

  /**
   * Fonction pour récupérer tous les journaux de modifications de jeu par le titre du jeu
   * @param {string} title - Le titre du jeu pour lequel récupérer les journaux de modifications
   * @returns {Promise<GameChangeLog[]>} - Un tableau de tous les journaux de modifications de jeu associés au titre du jeu
   */
  public static async getAllGameChangeLogByGameTitle(title: string): Promise<GameChangeLog[]> {
    try {
      // Récupérer le jeu par son titre
      const game: Game = await Game.query().where('title', title).firstOrFail()

      // Récupérer tous les journaux de modifications de jeu associés à l'ID du jeu trouvé
      return this.getAllGameChangeLogByGameId(game.id)
    } catch (error: any) {
      logger.error('getAllGameChangeLogByGameTitle error: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('Game not found with the given title')
      }

      throw new InternalServerErrorException('Failed to fetch all game change logs by game title')
    }
  }
}
