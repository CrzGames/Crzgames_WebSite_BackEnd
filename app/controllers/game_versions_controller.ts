import type { HttpContext } from '@adonisjs/core/http'
import GameVersionsService from '#services/game_versions_service'
import type GameVersion from '#models/game_version'
import { updateGameVersionValidator } from '#validators/game_versions/update_game_version_validator'
import { createGameVersionValidator } from '#validators/game_versions/create_game_version_validator'

/**
 *
 */
export default class GameVersionsController {
  // GET: Recupere la derniere version du jeu et qui est disponible pour le telechargement
  /**
   *
   */
  public async getLatestAvailableVersion({ params, response }: HttpContext): Promise<void> {
    const gameVersion: GameVersion = await GameVersionsService.getLatestAvailableVersion(params.gameId)
    response.ok(gameVersion)
  }

  // POST: Cree une version de jeu
  /**
   *
   */
  public async createGameVersion({ request, params, response }: HttpContext): Promise<void> {
    const payload: { version: string; is_available: boolean } = await request.validateUsing(createGameVersionValidator)
    const gameVersion: GameVersion = await GameVersionsService.createGameVersion(params.gameId, payload)
    response.created(gameVersion)
  }

  // GET: Recupere toutes la table pour n'importe quel jeu
  /**
   *
   */
  public async getAllGameVersions({ response }: HttpContext): Promise<void> {
    const gameVersions: GameVersion[] = await GameVersionsService.getAllGameVersions()
    response.ok(gameVersions)
  }

  // GET: Recupere toutes les versions pour un jeu specifique
  /**
   *
   */
  public async getAllGameVersionsByGameId({ params, response }: HttpContext): Promise<void> {
    const gameVersions: GameVersion[] = await GameVersionsService.getAllGameVersionsByGameId(params.gameId)
    response.ok(gameVersions)
  }

  // GET: Recupere une version de jeu specifique
  /**
   *
   */
  public async getGameVersion({ params, response }: HttpContext): Promise<void> {
    const gameVersion: GameVersion = await GameVersionsService.getGameVersion(params.gameId, params.gameVersionId)
    response.ok(gameVersion)
  }

  // PUT: Met a jour une version de jeu specifique
  /**
   *
   */
  public async updateGameVersion({ params, request, response }: HttpContext): Promise<void> {
    const payload: { is_available: boolean } = await request.validateUsing(updateGameVersionValidator)
    const gameVersion: GameVersion = await GameVersionsService.updateGameVersion(
      params.gameId,
      params.gameVersionId,
      payload.is_available,
    )
    response.ok(gameVersion)
  }

  // DELETE: Supprime une version de jeu specifique
  /**
   *
   */
  public async deleteGameVersion({ params, response }: HttpContext): Promise<void> {
    await GameVersionsService.deleteGameVersion(params.gameId, params.gameVersionId)
    response.ok({ message: 'Game version deleted successfully' })
  }
}
