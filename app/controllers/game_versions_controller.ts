import { HttpContext } from '@adonisjs/core/http'
import GameVersionsService from '#services/game_versions_service'
import GameVersion from '#models/game_version'
import CreateGameVersionValidator from '#validators/game_versions/create_game_version_validator'
import UpdateGameVersionValidator from '#validators/game_versions/update_game_version_validator'

export default class GameVersionsController {
  // GET: Recupere la derniere version du jeu et qui est disponible pour le telechargement
  public async getLatestAvailableVersion({
    params,
    response,
  }: HttpContext): Promise<void> {
    const gameVersion: GameVersion = await GameVersionsService.getLatestAvailableVersion(
      params.gameId,
    )
    return response.ok(gameVersion)
  }

  // POST: Crée une version de jeu
  public async createGameVersion({
    request,
    params,
    response,
  }: HttpContext): Promise<void> {
    const payload: { version: string; is_available: boolean } = await request.validate(
      CreateGameVersionValidator,
    )
    const gameVersion: GameVersion = await GameVersionsService.createGameVersion(
      params.gameId,
      payload,
    )
    return response.created(gameVersion)
  }

  // GET: Récupère toutes la table pour n'importe quel jeu
  public async getAllGameVersions({ response }: HttpContext): Promise<void> {
    const gameVersions: GameVersion[] = await GameVersionsService.getAllGameVersions()
    return response.ok(gameVersions)
  }

  // GET: Récupère toutes les versions pour un jeu spécifique
  public async getAllGameVersionsByGameId({
    params,
    response,
  }: HttpContext): Promise<void> {
    const gameVersions: GameVersion[] = await GameVersionsService.getAllGameVersionsByGameId(
      params.gameId,
    )
    return response.ok(gameVersions)
  }

  // GET: Récupère une version de jeu spécifique
  public async getGameVersion({ params, response }: HttpContext): Promise<void> {
    const gameVersion: GameVersion = await GameVersionsService.getGameVersion(
      params.gameId,
      params.gameVersionId,
    )
    return response.ok(gameVersion)
  }

  // PUT: Met à jour une version de jeu spécifique
  public async updateGameVersion({
    params,
    request,
    response,
  }: HttpContext): Promise<void> {
    const payload: { is_available: boolean } = await request.validate(UpdateGameVersionValidator)
    const gameVersion: GameVersion = await GameVersionsService.updateGameVersion(
      params.gameId,
      params.gameVersionId,
      payload.is_available,
    )
    return response.ok(gameVersion)
  }

  // DELETE: Supprime une version de jeu spécifique
  public async deleteGameVersion({ params, response }: HttpContext): Promise<void> {
    await GameVersionsService.deleteGameVersion(params.gameId, params.gameVersionId)
    return response.ok({ message: 'Game version deleted successfully' })
  }
}
